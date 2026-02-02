import React, { useState } from 'react'

function AddImages() {
    const [poleImages, setPoleImages] = useState([])
    const [lineImages, setLineImages] = useState([])

    const handlePreview = (files, setState) => {
        const previews = Array.from(files).map(file => ({
            file,
            url: URL.createObjectURL(file),
        }))
        setState(prev => [...prev, ...previews])
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 p-6">
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8">

                <h1 className="text-3xl font-bold text-center mb-10 text-purple-800">
                    Upload Infrastructure Images
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Pole Images */}
                    <div className="rounded-xl border border-purple-200 p-6 hover:shadow-md transition">
                        <h2 className="text-xl font-semibold mb-4 text-purple-700">
                            Pole Images
                        </h2>

                        <input
                            type="text"
                            placeholder="Pole Code"
                            className="w-full mb-3 border border-purple-300 rounded-md p-2 focus:ring-2 focus:ring-purple-400 outline-none"
                        />

                        <input
                            type="file"
                            multiple
                            onChange={(e) =>
                                handlePreview(e.target.files, setPoleImages)
                            }
                            className="w-full mb-4 file:mr-4 file:py-2 file:px-4
                                       file:rounded-md file:border-0
                                       file:bg-purple-600 file:text-white
                                       hover:file:bg-purple-700 cursor-pointer"
                        />

                        {poleImages.length > 0 && (
                           <div className="grid grid-cols-3 gap-3 mb-4 max-h-48 overflow-y-auto pr-2">
                                {poleImages.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img.url}
                                        alt="preview"
                                        className="h-24 w-full object-cover rounded-md border"
                                    />
                                ))}
                            </div>
                        )}

                        <button className="w-full py-3 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition">
                            Upload Pole Images
                        </button>
                    </div>

                    {/* Line Images */}
                    <div className="rounded-xl border border-purple-200 p-6 hover:shadow-md transition">
                        <h2 className="text-xl font-semibold mb-4 text-purple-700">
                            Line Images
                        </h2>

                        <input
                            type="text"
                            placeholder="Start Pole Code"
                            className="w-full mb-3 border border-purple-300 rounded-md p-2 focus:ring-2 focus:ring-purple-400 outline-none"
                        />

                        <input
                            type="text"
                            placeholder="End Pole Code"
                            className="w-full mb-3 border border-purple-300 rounded-md p-2 focus:ring-2 focus:ring-purple-400 outline-none"
                        />

                        <input
                            type="file"
                            multiple
                            onChange={(e) =>
                                handlePreview(e.target.files, setLineImages)
                            }
                            className="w-full mb-4 file:mr-4 file:py-2 file:px-4
                                       file:rounded-md file:border-0
                                       file:bg-purple-600 file:text-white
                                       hover:file:bg-purple-700 cursor-pointer"
                        />

                        {lineImages.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                {lineImages.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img.url}
                                        alt="preview"
                                        className="h-24 w-full object-cover rounded-md border"
                                    />
                                ))}
                            </div>
                        )}

                        <button className="w-full py-3 bg-purple-700 text-white rounded-md hover:bg-purple-900 transition">
                            Upload Line Images
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AddImages
