import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '../services/auth.service';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import '../styles/auth.css';

const registerSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  role: z.enum(['USER', 'INSTRUCTOR', 'ADMIN']),
  mobile: z.string().optional(),
  address: z.string().optional(),
  dob: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'USER',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.register(data);
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-header">
          <h1 className="auth-title">Create an Account</h1>
          <p className="auth-subtitle">Join our fitness community</p>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <Input
              id="name"
              {...register('name')}
              className={errors.name ? 'error' : ''}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="form-error">{errors.name.message}</p>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className={errors.email ? 'error' : ''}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="form-error">{errors.email.message}</p>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              className={errors.password ? 'error' : ''}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="form-error">{errors.password.message}</p>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select
              id="role"
              {...register('role')}
              className="form-input"
            >
              <option value="USER">User</option>
              <option value="INSTRUCTOR">Instructor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="mobile" className="form-label">
              Mobile Number (optional)
            </label>
            <Input
              id="mobile"
              {...register('mobile')}
              placeholder="+1 (123) 456-7890"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address" className="form-label">
              Address (optional)
            </label>
            <Input
              id="address"
              {...register('address')}
              placeholder="123 Main St, City"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="dob" className="form-label">
              Date of Birth (optional)
            </label>
            <Input
              id="dob"
              type="date"
              {...register('dob')}
            />
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
          
          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <a href="/login" className="auth-link">
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 