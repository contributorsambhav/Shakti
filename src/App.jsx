import FileUploadAndAnalyze from './components/FUA'
function App() {
  return (
   <div className='min-h-screen flex flex-col gap-10'>
    <div className='max-w-4xl mx-auto h-[30dvh] flex flex-col justify-center items-center'>
      <h3 className='text-5xl font-bold text-center'>
        Optimal Power Flow Analysis
      </h3>
      <h3 className='text-2xl font-light italic text-center'>
        Using Graphical Neural Network
      </h3>
    </div>
    <div className='p-5'>
      <FileUploadAndAnalyze />
    </div>
   </div>
  )
}

export default App
