import React, { useState } from 'react'
import axios from 'axios'

function AddImages() {
    const [poleImages, setPoleImages] = useState([])
    const [lineImages, setLineImages] = useState([])
    const [poleCode, setPoleCode] = useState('')
    const [startPoleCode, setStartPoleCode] = useState('')
    const [endPoleCode, setEndPoleCode] = useState('')

    const [showPoleConfirmModal, setShowPoleConfirmModal] = useState(false)
    const [showLineConfirmModal, setShowLineConfirmModal] = useState(false)

    const normalizeCode = (code) => code.trim().toUpperCase()

    const handlePoleUploadClick = async () => {
        const exists = await checkExistingPole()
        if (exists) {
            setShowPoleConfirmModal(true)
        } else {
            uploadPoleImages(false)
        }
    }

    const checkExistingPole = async () => {
        const code = normalizeCode(poleCode)
        const res = await axios.get(
            "http://localhost:8000/survey/check_existing_poles",
            { params: { poleCode: code } }
        )
        return res.data.exists
    }

    const handleLineUploadClick = async () => {
        const exists = await checkExistingLine()
        if (exists) {
            setShowLineConfirmModal(true)
        } else {
            uploadLineImages(false)
        }
    }

    const checkExistingLine = async () => {
        const start = normalizeCode(startPoleCode)
        const end = normalizeCode(endPoleCode)
        const res = await axios.get(
            "http://localhost:8000/survey/check_existing_lines",
            { params: { startPole: start, endPole: end } }
        )
        return res.data.exists
    }

    const handlePreview = (files, setState) => {
        const previews = Array.from(files).map(file => ({
            file,
            url: URL.createObjectURL(file),
        }))
        setState(prev => [...prev, ...previews])
    }

    const uploadPoleImages = async (replaceExisting) => {
        try {
            if (!poleCode) {
                alert("Pole code is required");
                return;
            }

            if (poleImages.length === 0) {
                alert("Select at least one image");
                return;
            }

            const formData = new FormData();

            formData.append("poleCode", normalizeCode(poleCode))
            formData.append("replaceExisting", replaceExisting)

            poleImages.forEach((img) => {
                formData.append("files", img.file);
            });

            const response = await axios.post(
                "http://localhost:8000/survey/upload_pole_images",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            console.log("Upload success:", response.data)
            alert("Pole images uploaded successfully");

            setPoleImages([]);
            setPoleCode("");

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                alert(err.response.data.message);
            } else {
                alert("Upload failed");
            }
        }
    };

    const uploadLineImages = async (replaceExisting) => {
        try {
            if (!startPoleCode || !endPoleCode) {
                alert("Both start and end pole codes are required");
                return;
            }

            if (lineImages.length === 0) {
                alert("Select at least one image");
                return;
            }

            const formData = new FormData();

            formData.append("startPoleCode", normalizeCode(startPoleCode))
            formData.append("endPoleCode", normalizeCode(endPoleCode))
            formData.append("replaceExisting", replaceExisting)

            // Upload line images
            lineImages.forEach((img) => {
                formData.append("files", img.file);
            });

            const response = await axios.post(
                "http://localhost:8000/survey/upload_line_images",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("Upload success:", response.data);
            alert("Line images uploaded successfully");

            // Reset line state only
            setLineImages([]);
            setStartPoleCode("");
            setEndPoleCode("");

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                alert(err.response.data.message);
            } else {
                alert("Upload failed");
            }
        }
    };


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
                            value={poleCode}
                            onChange={(e) => setPoleCode(e.target.value)}
                            className="w-full mb-3 border border-purple-300 focus:ring-2 outline-none focus:ring-purple-400 rounded-md p-2"
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

                        <button
                            onClick={handlePoleUploadClick}
                            className="w-full py-3 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition">
                            Upload Pole Images
                        </button>
                    </div>

                    {/* Line Images */}
                    <div className="rounded-xl border border-purple-200 p-6 hover:shadow-md transition">
                        <h2 className="text-xl font-semibold mb-4 text-purple-700">
                            Line Images
                        </h2>

                        <input
                            value={startPoleCode}
                            onChange={(e) => setStartPoleCode(e.target.value)}
                            type="text"
                            placeholder="Start Pole Code"
                            className="w-full mb-3 border border-purple-300 rounded-md p-2 focus:ring-2 focus:ring-purple-400 outline-none"
                        />

                        <input
                            value={endPoleCode}
                            onChange={(e) => setEndPoleCode(e.target.value)}
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

                        <button
                            onClick={handleLineUploadClick}
                            className="w-full py-3 bg-purple-700 text-white rounded-md hover:bg-purple-900 transition">
                            Upload Line Images
                        </button>
                    </div>

                    {/* pole modal comfirmation */}
                    {showPoleConfirmModal && (
                        <div className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl p-6 w-96
                                border border-purple-200
                                shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
                                <h3 className="text-lg font-semibold mb-3 text-purple-700">
                                    Existing images found
                                </h3>
                                <p className="mb-4 text-sm text-gray-600">
                                    Images already exist for this pole.
                                    What do you want to do?
                                </p>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setShowPoleConfirmModal(false)}
                                        className="px-4 py-2 border border-purple-300 rounded-md"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={() => {
                                            setShowPoleConfirmModal(false)
                                            uploadPoleImages(false)
                                        }}
                                        className="px-4 py-2 bg-purple-200 rounded-md"
                                    >
                                        Keep Existing
                                    </button>

                                    <button
                                        onClick={() => {
                                            setShowPoleConfirmModal(false)
                                            uploadPoleImages(true)
                                        }}
                                        className="px-4 py-2 bg-purple-700 text-white rounded-md"
                                    >
                                        Replace
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* line modal confirmation */}
                    {showLineConfirmModal && (
                        <div className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl p-6 w-96
                                    border border-purple-200
                                    shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
                                <h3 className="text-lg font-semibold mb-3 text-purple-700">
                                    Existing line images found
                                </h3>
                                <p className="mb-4 text-sm text-gray-600">
                                    Images already exist for this line.
                                    What do you want to do?
                                </p>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setShowLineConfirmModal(false)}
                                        className="px-4 py-2 border rounded-md"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={() => {
                                            setShowLineConfirmModal(false)
                                            uploadLineImages(false)
                                        }}
                                        className="px-4 py-2 bg-purple-200 rounded-md"
                                    >
                                        Keep Existing
                                    </button>

                                    <button
                                        onClick={() => {
                                            setShowLineConfirmModal(false)
                                            uploadLineImages(true)
                                        }}
                                        className="px-4 py-2 bg-purple-700 text-white rounded-md"
                                    >
                                        Replace
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default AddImages
