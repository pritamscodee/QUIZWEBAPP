import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { NeoButton } from './NeoButton';

const NavLink = ({ to, children, color = "hover:bg-yellow-300" }: any) => (
    <Link
        to={to}
        className={`relative font-black uppercase text-xs tracking-widest px-4 py-2 rounded-xl border-4 border-black transition-all hover:-translate-y-1 hover:-rotate-2 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:rotate-0 active:shadow-none ${color}`}
    >
        {children}
    </Link>
);

export const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    const isAdmin = user?.role === 'admin';

    return (
        <nav className="bg-white p-4 sticky top-0 z-50">
            <div className="container mx-auto max-w-6xl bg-white border-4 border-black rounded-3xl px-6 py-3 flex justify-between items-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <Link to="/" className="group relative">
                    <div className="bg-[#5c94ff] border-4 border-black px-3 py-1 rounded-xl -rotate-3 group-hover:rotate-3 transition-transform duration-200">
                        <span className="text-xl font-black text-white italic uppercase">Quiz!</span>
                    </div>
                    <span className="absolute -top-2 -right-2 text-xl">✨</span>
                </Link>
                <div className="flex items-center gap-3">
                    <NavLink to="/quizzes" color="hover:bg-blue-300">Quizzes</NavLink>
                    {isAuthenticated ? (
                        <>
                            <NavLink to="/dashboard" color="hover:bg-green-300">Dash</NavLink>
                            {isAdmin && <NavLink to="/create-quiz" color="hover:bg-purple-300">Create</NavLink>}
                            <div className="w-[4px] h-8 bg-black rounded-full mx-1 hidden md:block" />
                            <NavLink to="/profile" color="hover:bg-yellow-300">Profile</NavLink>
                            <button
                                onClick={handleLogout}
                                className="bg-red-400 border-4 border-black px-4 py-2 rounded-xl font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                            >
                                Exit
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-2">
                            <NavLink to="/login">Login</NavLink>
                            <Link
                                to="/register"
                                className="bg-black text-white border-4 border-black px-4 py-2 rounded-xl font-black uppercase text-xs hover:bg-[#5c94ff] transition-colors"
                            >
                                Join
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};