// app/page.tsx
"use client"; 
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import TodoList from './auth/todo-list/page';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/signin');  
    }
  }, [isAuthenticated, router]);


  return (
    <React.Fragment>
      <TodoList/>
    </React.Fragment>
      
  );
};

export default HomePage;
