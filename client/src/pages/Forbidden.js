export default function Forbidden() {
  return (
    <div className="bg-gradient-to-b from-cyan-700 to-blue-700 h-screen flex justify-center items-center">
     
      <div className="p-20 bg-white rounded shadow shadow-blue-200 opacity-90">
        <div>
          <h1 className="text-3xl">Error: 403</h1>
          <h2 className="text-7xl">Forbidden</h2>
        </div>

        <div className="py-8 text-center">
          <p>You are trying to enter a forbidden route</p>
        </div>

      </div>
    </div>
  );
}