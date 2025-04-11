import FileUploadAndAnalyze from './components/FUA'
function App() {
  return (
   <div className='min-h-screen flex flex-col text-white gap-10'>
   <section className='w-full bg-gradient-to-br from-neutral-800 to-neutral-800 py-16 shadow-sm'>
      <div className='max-w-4xl mx-auto h-[40dvh] flex flex-col justify-center items-center gap-1 px-4'>
        <h1 className='text-5xl md:text-6xl font-bold text-center text-white'>
          Optimal Power Flow Analysis
        </h1>
        <h2 className='text-2xl font-light italic text-center max-w-2xl animate-slideUp'>
          Using Graphical Neural Network
        </h2>
        <p className='text-center font-light mt-4 text-white max-w-lg animate-fadeIn'>
          Advanced power system optimization through machine learning techniques for efficient grid management
        </p>
      </div>
    </section>
    <div className='p-5'>
      <FileUploadAndAnalyze />
    </div>
   </div>
  )
}

export default App
