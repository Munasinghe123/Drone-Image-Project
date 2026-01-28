
import mapbg from '../Images/map-bg.png';



function LandingPage() {
    return (
        <div className='relative h-screen overflow-hidden w-full items-center justify-center flex'>

            <img
                src={mapbg}
                className="absolute inset-0 z-0 w-full h-full object-cover pointer-events-none opacity-80"
            />

            <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] pointer-events-none z-0"></div>

            <div className='grid grid-cols-5 z-10 p-4 w-full h-full '>

                {/* col 1 */}
                <div className="col-span-2 flex flex-col justify-center pl-5 gap-10 lg:mt-9 ">

                    <h1 className="text-6xl font-extrabold leading-tight">
                        <span className="text-black">From Aerial Images</span>
                        <br />
                        <span className="text-purple-700">to Actionable Insights</span>
                    </h1>

                    <p className="text-lg  max-w-xl">
                        Drone-based image capture and intelligent data analysis to enable
                        safer, faster, and more accurate powerline inspections.
                    </p>

                    <div className="flex gap-4 pt-4">
                        <button className="bg-purple-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-800 transition">
                            Get Started
                        </button>

                        <button className="border border-purple-700 text-purple-700 px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition">
                            Learn More
                        </button>
                    </div>
                </div>

                {/* col 2 */}
                <div className="col-span-3 ">


                </div>
            </div>
        </div>
    )
}

export default LandingPage