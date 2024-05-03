import SwearInput from "./components/SwearInput";


export default function Home() {
  

  return (
    <main className="flex min-h-screen flex-col p-4">
      <div className="main-content grid w-full grid-cols-2 gap-4 pt-10">
        <div className="left">
          <h1 className="font-semibold font-roboto text-7xl p-3 bg-gradient-to-r from-blue-600 to-blue-900 text-transparent bg-clip-text">
            Profanity Api
          </h1>
        </div>
        <div className="right flex flex-col items-center">
          <SwearInput />
        </div>
      </div>
    </main>
  );
}
