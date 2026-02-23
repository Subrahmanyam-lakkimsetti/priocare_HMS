export default function SectionCard({ title, active, preview, children }) {
  return (
    <div className="border rounded-xl p-5 transition-all bg-white">
      <h2 className="text-xl font-semibold text-primary mb-3">{title}</h2>

      {!active && preview && (
        <div className="text-gray-600 bg-gray-50 p-3 rounded-lg text-sm">
          {preview}
        </div>
      )}

      {active && <div className="space-y-4">{children}</div>}
    </div>
  );
}
