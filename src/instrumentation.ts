export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await registerNode();
  } else if (process.env.NEXT_RUNTIME === 'edge') {
    await registerEdge();
  }
}

async function dynamicImport(modulePath: string): Promise<Record<string, unknown> | null> {
  try {
    const mod = await import(/* webpackIgnore: true */ modulePath);
    return mod as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function registerNode(): Promise<void> {
  const otelEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
  if (!otelEndpoint) return;

  const sdkMod = await dynamicImport('@opentelemetry/sdk-node');
  if (!sdkMod) return;

  const traceExporterMod = await dynamicImport('@opentelemetry/exporter-trace-otlp-http');
  const metricExporterMod = await dynamicImport('@opentelemetry/exporter-metrics-otlp-http');
  const resourceMod = await dynamicImport('@opentelemetry/resources');
  const semanticMod = await dynamicImport('@opentelemetry/semantic-conventions');
  const autoInstrMod = await dynamicImport('@opentelemetry/auto-instrumentations-node');

  if (!traceExporterMod || !metricExporterMod || !resourceMod || !semanticMod || !autoInstrMod) {
    return;
  }

  try {
    const NodeSDK = sdkMod.NodeSDK as new (opts: Record<string, unknown>) => { start: () => void; shutdown: () => Promise<void> };
    const OTLPTraceExporter = traceExporterMod.OTLPTraceExporter as new (opts: { url: string }) => unknown;
    const OTLPMetricExporter = metricExporterMod.OTLPMetricExporter as new (opts: { url: string }) => unknown;
    const Resource = resourceMod.Resource as new (attrs: Record<string, string>) => unknown;
    const SemanticResourceAttributes = semanticMod.SemanticResourceAttributes as Record<string, string>;
    const getNodeAutoInstrumentations = autoInstrMod.getNodeAutoInstrumentations as () => unknown[];

    const SRV_NAME = SemanticResourceAttributes['SERVICE_NAME'] ?? 'service.name';
    const SRV_VER = SemanticResourceAttributes['SERVICE_VERSION'] ?? 'service.version';
    const SRV_ENV = SemanticResourceAttributes['DEPLOYMENT_ENVIRONMENT'] ?? 'deployment.environment';

    const traceExporter = new OTLPTraceExporter({ url: otelEndpoint });
    const metricExporter = new OTLPMetricExporter({ url: otelEndpoint });

    const sdk = new NodeSDK({
      traceExporter,
      metricExporter,
      resource: new Resource({
        [SRV_NAME]: 'marketplace',
        [SRV_VER]: process.env.npm_package_version ?? '1.0.0',
        [SRV_ENV]: process.env.NODE_ENV ?? 'development',
      }),
      instrumentations: [getNodeAutoInstrumentations()],
    });

    sdk.start();
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      process.on('SIGTERM', () => {
        sdk.shutdown().catch(console.error);
      });
    }
  } catch {
    // OpenTelemetry optional — skip if initialization fails
  }
}

async function registerEdge(): Promise<void> {
  const otelEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
  if (!otelEndpoint) return;

  const apiMod = await dynamicImport('@opentelemetry/api');
  if (!apiMod) return;

  const webTracerMod = await dynamicImport('@opentelemetry/sdk-trace-web');
  const traceExporterMod = await dynamicImport('@opentelemetry/exporter-trace-otlp-http');
  const traceBaseMod = await dynamicImport('@opentelemetry/sdk-trace-base');

  if (!webTracerMod || !traceExporterMod || !traceBaseMod) return;

  try {
    const trace = apiMod.trace as { getTracer: (name: string) => unknown };
    const WebTracerProvider = webTracerMod.WebTracerProvider as new () => { addSpanProcessor: (p: unknown) => void; register: () => void };
    const OTLPTraceExporter = traceExporterMod.OTLPTraceExporter as new (opts: { url: string }) => unknown;
    const BatchSpanProcessor = traceBaseMod.BatchSpanProcessor as new (e: unknown) => unknown;

    const provider = new WebTracerProvider();
    provider.addSpanProcessor(
      new BatchSpanProcessor(new OTLPTraceExporter({ url: otelEndpoint }))
    );
    trace.getTracer('marketplace-edge');
    provider.register();
  } catch {
    // OpenTelemetry optional — skip if initialization fails
  }
}
