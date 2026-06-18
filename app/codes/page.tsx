const INSURANCE_CODES = [
  { code: 'A', name: '핵의학검사용군' },
  { code: 'B', name: '봉합용군' },
  { code: 'C', name: '골유합 및 골절고정용군' },
  { code: 'D', name: '관절경 수술 관련 연부조직 고정용군' },
  { code: 'E', name: '인공관절군' },
  { code: 'F', name: '척추재료군' },
  { code: 'G', name: '흉부외과용군' },
  { code: 'H', name: '신경외과용군' },
  { code: 'I', name: '안·이비인후과용군' },
  { code: 'J', name: '중재적시술용군' },
  { code: 'K', name: '일반재료군 (I)' },
  { code: 'L', name: '일반재료군 (II)' },
  { code: 'M', name: '일반재료군 (III)' },
  { code: 'N', name: '정액수가 품목' },
  { code: 'P', name: '한방재료군' },
]

export default function CodesPage() {
  return (
    <>
      <div>
        <h2 className="text-lg font-bold text-white">보험코드 분류</h2>
        <p className="text-xs text-slate-500 mt-0.5">보험코드 앞자리 알파벳별 품목군 기준표</p>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider w-24">군</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">항목</th>
            </tr>
          </thead>
          <tbody>
            {INSURANCE_CODES.map(({ code, name }, i) => (
              <tr
                key={code}
                className={`border-b border-slate-800/60 hover:bg-slate-800/40 transition-colors ${
                  i === INSURANCE_CODES.length - 1 ? 'border-b-0' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 font-bold font-mono border border-sky-500/20">
                    {code}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-200">{name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
