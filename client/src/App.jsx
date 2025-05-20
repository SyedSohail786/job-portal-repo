import Navbar from './components/Navbar'
import Hero from './components/Hero'
import JobList from './pages/JobList'
import Footer from './components/Footer'
import Download from './components/Download'

function App() {

  return (
    <>
      <div>
        <Navbar />
        <Hero />
        <JobList />
        <Download />
        <Footer />
      </div>
    </>
  )
}

export default App
