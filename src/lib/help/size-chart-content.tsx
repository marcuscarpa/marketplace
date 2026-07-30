export function SizeChartTables() {
  return (
    <div className="space-y-14 font-sans-ui text-sm text-neutral-700">
      <section>
        <h2 className="mb-6 font-serif text-xl uppercase tracking-[0.06em] text-neutral-900">
          Bikinis &amp; One-Piece
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-left uppercase tracking-wider">Size</th>
                <th className="px-3 py-2 text-left uppercase tracking-wider">Reference</th>
                <th className="px-3 py-2 text-left uppercase tracking-wider">Bust</th>
                <th className="px-3 py-2 text-left uppercase tracking-wider">Waist</th>
                <th className="px-3 py-2 text-left uppercase tracking-wider">Hip</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['S', '36-38', '84 cm', '64 cm', '94 cm'],
                ['M', '40-42', '88 cm', '68 cm', '98 cm'],
                ['L', '42-44', '92 cm', '72 cm', '102 cm'],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-neutral-100">
                  {row.map((cell) => (
                    <td key={`${row[0]}-${cell}`} className="px-3 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 font-serif text-xl uppercase tracking-[0.06em] text-neutral-900">
          Ready-to-Wear and Cover-Ups
        </h2>
        <p className="mb-6 text-sm text-neutral-600">Measurements: CM, Bust, Waist, Hip</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-left uppercase tracking-wider">Size</th>
                <th className="px-3 py-2 text-left uppercase tracking-wider">CM</th>
                <th className="px-3 py-2 text-left uppercase tracking-wider">Bust</th>
                <th className="px-3 py-2 text-left uppercase tracking-wider">Waist</th>
                <th className="px-3 py-2 text-left uppercase tracking-wider">Hip</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['XS', '80-82 cm', '62-64 cm', '76 cm', '90-92 cm'],
                ['S', '86-88 cm', '68-70 cm', '80 cm', '96-98 cm'],
                ['M', '92-94 cm', '74-76 cm', '84 cm', '100-102 cm'],
                ['L', '98-100 cm', '80-82 cm', '88 cm', '104-108 cm'],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-neutral-100">
                  {row.map((cell) => (
                    <td key={`${row[0]}-${cell}`} className="px-3 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
