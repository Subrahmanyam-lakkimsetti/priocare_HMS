import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from './authThunks';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, error, loading } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  // role based redirect
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    console.log('user', user);

    if (user.role === 'patient') navigate('/patient');
    else if (user.role === 'doctor') navigate('/doctor');
    else if (user.role === 'admin') navigate('/admin');
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit}
        className="bg-card p-8 rounded-xl shadow-md w-80 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-primary text-center">
          Hospital Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {error && <p className="text-danger text-sm">{error}</p>}

        <button className="w-full bg-primary text-white py-2 rounded hover:opacity-90">
          Login
        </button>
      </form>
    </div>
  );
}