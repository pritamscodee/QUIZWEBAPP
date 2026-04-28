import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Navbar } from '../components/ui/Navbar';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';
import { Sparkle } from '../components/ui/Sparkle';

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <Navbar />
      <div className="min-h-screen font-sans text-black">
        <div className="container mx-auto px-4 py-20 max-w-4xl text-center">
          <div className="relative mb-16 inline-block">
            <div className="bg-yellow-400 border-4 border-black px-8 py-4 md:px-12 md:py-6 rounded-[30px] -rotate-2 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                Test Your <br /> Knowledge
              </h1>
            </div>

            <Sparkle className="absolute -top-8 -left-8 text-[#5c94ff] w-12 h-12 animate-pulse" />
            <Sparkle className="absolute -bottom-6 -right-6 text-green-400 w-10 h-10 animate-bounce" />
            <div className="absolute -right-12 top-0 bg-purple-500 text-white border-2 border-black rounded-full px-4 py-1 font-black text-xs uppercase rotate-12 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hidden md:block">
              New Quizzes! ✨
            </div>
          </div>

          <NeoCard className="rounded-[45px] border-4 p-10 shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 border-4 border-black opacity-50"></div>

            <p className="relative z-10 text-xl md:text-2xl font-bold text-gray-700 mb-10 leading-relaxed">
              Challenge yourself with <span className="underline decoration-[#5c94ff] decoration-4">interactive quizzes</span> across science, tech, history, and more!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
              <Link to="/quizzes" className="w-full sm:w-auto">
                <NeoButton
                  className="w-full sm:w-64 py-5 rounded-2xl bg-[#5c94ff] text-white text-xl font-black uppercase italic tracking-tighter shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-600"
                >
                  Browse Quizzes
                </NeoButton>
              </Link>

              {!isAuthenticated && (
                <Link to="/register" className="w-full sm:w-auto">
                  <NeoButton
                    className="w-full sm:w-64 py-5 rounded-2xl bg-green-400 text-black text-xl font-black uppercase italic tracking-tighter shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-green-500"
                  >
                    Get Started
                  </NeoButton>
                </Link>
              )}

              {isAuthenticated && (
                <Link to="/dashboard" className="w-full sm:w-auto">
                  <NeoButton
                    className="w-full sm:w-64 py-5 rounded-2xl bg-purple-500 text-white text-xl font-black uppercase italic tracking-tighter shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-purple-600"
                  >
                    My Dashboard
                  </NeoButton>
                </Link>
              )}
            </div>
          </NeoCard>
        </div>
      </div>
    </>
  );
}