
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import FloatingInput from '../components/FloatingInput';
import React, { useState, useEffect } from 'react';
import { SquareUserRound, Mail, KeyRound, MoveRight, MoveLeft } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
// import { useDispatch }  from 'react-redux';
// import { loginSuccess } from '../../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import HeroBackground from '../Images/map-bg.png';


export default function SignIn() {

    // const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

    //form data
    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Detect screen resize , update layout mode
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleRegister = async (e) => {

        e.preventDefault();

        try {

            if (name.trim() === "" || userName.trim() === "" || email.trim() === "" || password.trim() === "") {
                alert('Please fill in all fields.');
                return;
            }

            console.log("registering", { name, userName, email, password });

            const response = await axios.post('http://localhost:7000/api/register', {
                name, username: userName, email, password
            })

            setName('');
            setUserName('');
            setEmail('');
            setPassword('');

            console.log('Registration successful:', response.data);
            toast.success("Registration successful! You can now log in.");
        } catch (error) {
            const message = error.response?.data?.error || "Registration failed"
            toast.error(message);

        }

    }

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            if (email.trim() === "" || password.trim() === "") {
                alert('Please fill in all fields.');
                return;
            }

            const response = await axios.post('http://localhost:7000/api/login', {
                email, password
            }, { withCredentials: true })

            setEmail('');
            setPassword('');

            // dispatch(loginSuccess({user:response.data.user}));

            if (response.data.user.role === "admin") {
                navigate('/admin');
            } else if (response.data.user.role === "restaurantOwner") {
                navigate("/restaurant-owner");
            }
            else {
                navigate("/user");
            }

            console.log('Login successful:', response.data);
            toast.success("Successfully logged in!");
        } catch (error) {
            const message = error.response?.data?.error || "Login failed"
            toast.error(message);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen relative py-10">

            {/* Background */}
            <img
                src={HeroBackground}
                className="absolute inset-0 -z-10 w-full h-full object-cover"
                alt="Background"
            />

            {/* MAIN CARD */}
            <div className="relative w-[900px] max-w-[95%]  lg:mt-20 h-[500px] border border-purple-400 backdrop-blur-xl rounded-4xl overflow-hidden shadow-2xl">

                {/* DESKTOP VERSION (SLIDING) */}
                {isDesktop && (
                    <>
                        {/* FORM PANEL */}
                        <div
                            style={{
                                transform: isLogin ? "translateX(0)" : "translateX(100%)",
                                transition: "transform 0.8s ease-in-out",
                            }}
                            className="absolute top-0 left-0 w-1/2 h-full flex items-center justify-center p-8"
                        >
                            {isLogin ? (
                                <form onSubmit={handleLogin} className="w-xs">
                                    <h2 className="text-3xl font-bold mb-6 text-center">
                                        <span className="text-black">Log</span>
                                        <span className="text-purple-800">in</span>
                                    </h2>

                                    <div className="space-y-4">
                                        <FloatingInput
                                            label="Email"
                                            type="email"
                                            icon={Mail}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <FloatingInput
                                            label="Password"
                                            type="password"
                                            icon={KeyRound}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />

                                        <button
                                        onClick={() => navigate('/add-images')}
                                        className="w-full text-lg py-3 bg-purple-800/90 text-white rounded-md hover:bg-black hover:text-purple-500 transition-colors">Login</button>

                                        <button
                                            type='submit'
                                            className="flex w-full py-3 text-lg items-center justify-center gap-2 bg-purple-800/90 text-white rounded-md hover:bg-black hover:text-purple-500 transition-colors">
                                            <FontAwesomeIcon icon={faGoogle} className="w-5 h-5" />
                                            Login with Google
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form className="w-xs" onSubmit={handleRegister}>
                                    <h2 className="text-3xl font-bold mb-6 text-center">
                                        <span className="text-black">Regis</span>
                                        <span className="text-purple-800">ter</span>
                                    </h2>
                                    <div className="space-y-4">
                                        <FloatingInput label="Full Name" type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            icon={SquareUserRound} />

                                        <FloatingInput label="User Name" type="text"
                                            icon={SquareUserRound}
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                        />

                                        <FloatingInput label="Email" type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            icon={Mail} />
                                        <FloatingInput label="Password" type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            icon={KeyRound} />

                                        <button className="w-full py-3 text-lg bg-purple-800/90 text-white rounded-md hover:bg-black hover:text-purple-500 transition-colors"
                                            type='submit'>
                                            Register
                                        </button>

                                        <button
                                            className="flex items-center justify-center text-lg gap-2 w-full py-3 bg-purple-800/90 text-white rounded-md hover:bg-black hover:text-purple-800/90 transition-colors">
                                            <FontAwesomeIcon icon={faGoogle} className="w-5 h-5" />
                                            Register with Google
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* ANIMATED PANEL */}
                        <div
                            style={{
                                transform: isLogin ? "translateX(100%)" : "translateX(0)",
                                transition: "transform 0.8s ease-in-out",
                            }}
                            className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-purple-800/90 to-black text-white flex flex-col items-center justify-center p-10"
                        >
                            {isLogin ? (
                                <div className="text-center">
                                    <img/>
                                    <h2 className="text-3xl font-bold mb-4">You don't have an account?</h2>
                                    <p className="mb-6 text-white">Register with your personal details to use all features.</p>
                                    <button onClick={() => setIsLogin(false)} className="px-6 py-2 text-lg border-2 border-white rounded-md hover:bg-white hover:text-purple-700 transition-colors w-2xs">Register</button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                                    <p className="mb-6 text-white">To stay connected, login with your information.</p>
                                    <button onClick={() => setIsLogin(true)} className="px-6 py-2 text-lg border-2 border-white rounded-md hover:bg-white hover:text-purple-700 transition-colors w-2xs">Login</button>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* MOBILE VERSION (FLIPPING CARD)*/}
                {!isDesktop && (
                    <div className="relative w-full h-full flex items-center justify-center perspective">

                        <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isLogin ? "" : "rotate-y-180"}`}>

                            {/* FRONT - LOGIN */}
                            <form
                                onSubmit={handleLogin}
                                className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8">
                                <h2 className="text-3xl font-bold mb-6 text-center text-black">Login</h2>
                                <div className="space-y-4 w-full max-w-xs">
                                    <FloatingInput label="Email" type="email" icon={Mail} />
                                    <FloatingInput label="Password" type="password" icon={KeyRound} />

                                    <button className="w-full py-3 bg-purple-800/90 text-black rounded-md hover:bg-black hover:text-purple-500 transition-colors">Login</button>

                                    <button
                                        type='submit'
                                        className="w-full flex items-center justify-center  py-3 bg-gray-800 text-white rounded-md" onClick={() => setIsLogin(false)}>
                                        <div className='flex gap-4'>
                                            Go to Register < MoveRight />
                                        </div>

                                    </button>
                                </div>
                            </form>

                            {/* BACK - REGISTER */}
                            <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-8">
                                <h2 className="text-3xl font-bold mb-6 text-center text-black">Register</h2>
                                <form className="space-y-4 w-full max-w-xs" onSubmit={handleRegister}>
                                    <FloatingInput label="Full Name" type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        icon={SquareUserRound} />

                                    <FloatingInput label="User Name" type="text"
                                        icon={SquareUserRound}
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                    />

                                    <FloatingInput label="Email" type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        icon={Mail} />
                                    <FloatingInput label="Password" type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        icon={KeyRound} />

                                    <button className="w-full py-3 bg-purple-800/90 text-black rounded-md hover:bg-black hover:text-purple-500 transition-colors"
                                        type='submit'
                                    >
                                        Register</button>

                                    <button className="w-full flex items-center justify-center py-3 bg-gray-800 text-white rounded-md" onClick={() => setIsLogin(true)}>
                                        <div className='flex gap-4'>
                                            <MoveLeft /> Back to Login
                                        </div>

                                    </button>
                                </form>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
