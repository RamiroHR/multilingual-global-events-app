// import Image from "next/image";

export default function Home() {
  return(
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1> Hello there! </h1>
      <p> Join our comunity events </p>
      <button className="border rounded bg-gray-600 text-white px-4 py-2 hover:bg-gray-700">
        Start Exploring
      </button>
      <img src="./astronaut.png" width={200}/>
    </main>
  )
}
