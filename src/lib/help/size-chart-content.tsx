const BRAND = 'Sinesia Karol';

export function SizeChartTables() {
  return (
    <div className="space-y-14">
      <section>
        <h2 className="mb-2 font-serif text-xl uppercase tracking-[0.06em] text-neutral-900">Clothing — Size Conversions</h2>
        <p className="mb-6 text-sm text-neutral-600">
          0P refers to our unique sizing for petite frames, specially designed with petite proportions suited to clients under 5&apos;3&quot; / 160cm.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-left uppercase tracking-wider">Country</th>
                <th className="px-3 py-2 text-left">0P</th>
                <th className="px-3 py-2 text-left">0</th>
                <th className="px-3 py-2 text-left">1</th>
                <th className="px-3 py-2 text-left">2</th>
                <th className="px-3 py-2 text-left">3</th>
                <th className="px-3 py-2 text-left">4</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Australia', '6P', '8', '10', '12', '14', '16'],
                ['UK', '6P', '8', '10', '12', '14', '16'],
                ['US', '2P', '4', '6', '8', '10', '12'],
                ['Italy', '38P', '40', '42', '44', '46', '48'],
                ['France', '34P', '36', '38', '40', '42', '44'],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-neutral-100">
                  {row.map((cell, i) => (
                    <td key={`${row[0]}-${i}`} className="px-3 py-2">
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
        <h2 className="mb-6 font-serif text-xl uppercase tracking-[0.06em] text-neutral-900">Clothing — Body Measurements (CM)</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-left">Size</th>
                {['0P', '0', '1', '2', '3', '4'].map((s) => (
                  <th key={s} className="px-3 py-2 text-left">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Bust', [79, 84, 89, 94, 99, 104]],
                ['Waist', [62, 65, 70, 75, 80, 85]],
                ['Hips', [86, 91, 96, 101, 106, 111]],
              ].map(([label, values]) => (
                <tr key={label as string} className="border-b border-neutral-100">
                  <td className="px-3 py-2 font-medium">{label as string}</td>
                  {(values as number[]).map((v) => (
                    <td key={v} className="px-3 py-2">
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-6 font-serif text-xl uppercase tracking-[0.06em] text-neutral-900">Denim — Body Measurements (CM)</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-left">Size</th>
                {['24', '25', '26', '27', '28', '29', '30', '31', '32'].map((s) => (
                  <th key={s} className="px-3 py-2 text-left">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-neutral-100">
                <td className="px-3 py-2 font-medium">Waist</td>
                {[60, 62.5, 65, 67.5, 70, 72.5, 75, 77.5, 80].map((v) => (
                  <td key={v} className="px-3 py-2">
                    {v}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-neutral-100">
                <td className="px-3 py-2 font-medium">Hip</td>
                {[86, 88.5, 91, 93.5, 96, 98.5, 101, 103.5, 106].map((v) => (
                  <td key={v} className="px-3 py-2">
                    {v}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-6 font-serif text-xl uppercase tracking-[0.06em] text-neutral-900">Shoes — Size Conversions</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-left">Size</th>
                {['35', '36', '37', '38', '39', '40', '41'].map((s) => (
                  <th key={s} className="px-3 py-2 text-left">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Australia', ['4.5', '5.5', '6.5', '7.5', '8.5', '9.5', '10.5']],
                ['US', ['5.5', '6', '6.5', '7.5', '8', '9', '9.5']],
                ['UK', ['2.5', '3', '4', '5', '6', '7', '8']],
                ['Foot length (CM)', ['22.6', '23.3', '24', '24.6', '25.3', '26', '26.6']],
              ].map(([label, values]) => (
                <tr key={label as string} className="border-b border-neutral-100">
                  <td className="px-3 py-2 font-medium">{label as string}</td>
                  {(values as string[]).map((v) => (
                    <td key={v} className="px-3 py-2">
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-6 font-serif text-xl uppercase tracking-[0.06em] text-neutral-900">Kids — Body Measurements (CM)</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2 text-left">Size</th>
                {['1', '2', '4', '6', '8', '10', '12'].map((s) => (
                  <th key={s} className="px-3 py-2 text-left">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Height', [84, 92, 108, 120, 130, 140, 150]],
                ['Chest', [53, 56, 60, 64, 70, 76, 79]],
                ['Waist', [52, 54, 56, 58, 60, 62, 64]],
                ['Hip', [55, 58, 62, 66, 72, 78, 81]],
              ].map(([label, values]) => (
                <tr key={label as string} className="border-b border-neutral-100">
                  <td className="px-3 py-2 font-medium">{label as string}</td>
                  {(values as number[]).map((v) => (
                    <td key={v} className="px-3 py-2">
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-neutral-600">Kids sizing is approximately age equivalent.</p>
      </section>

      <p className="text-sm text-neutral-500">{BRAND} size guide — measurements are approximate.</p>
    </div>
  );
}
