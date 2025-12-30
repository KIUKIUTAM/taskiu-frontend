import React, { useEffect, useRef } from 'react';
import { userApi } from '@/api/User/userApi';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">My Learning App</h1>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome Back!</h2>
          <p className="text-gray-600 text-lg">Start your learning journey today.</p>
        </section>
        <section className="bg-white rounded-lg shadow p-8 mb-8">
          <img
            alt="User Avatar"
            style={{
              width: '50px',
              borderRadius: '50%',
            }}
            referrerPolicy="no-referrer"
          />
          {}
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Courses</h3>
            <p className="text-gray-600">Access all your enrolled courses</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress</h3>
            <p className="text-gray-600">Track your learning progress</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Achievements</h3>
            <p className="text-gray-600">View your badges and certificates</p>
          </div>
        </div>
        <button className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
          test
        </button>
      </main>
    </div>
  );
};

export default HomePage;
