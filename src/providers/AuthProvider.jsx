import React, { createContext, useEffect, useState } from 'react';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup, 
    onAuthStateChanged, 
    signOut,
    updateProfile
} from "firebase/auth";
import app from '../firebase/firebase.config'; // আপনার ফায়ারবেস কনফিগারেশন ফাইল

// ১. কনটেক্সট তৈরি করা হলো
export const AuthContext = createContext(null);

// ফায়ারবেস থেকে auth অবজেক্ট নেওয়া হচ্ছে
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
    // ২. ব্যবহারকারীর তথ্য এবং লোডিং অবস্থা রাখার জন্য দুটি স্টেট
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ৩. ফায়ারবেসের বিভিন্ন অথেনটিকেশন ফাংশনকে র‍্যাপ করে নতুন ফাংশন তৈরি করা
    
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };
    
    const googleSignIn = () => {
        setLoading(true);
        const googleProvider = new GoogleAuthProvider();
        return signInWithPopup(auth, googleProvider);
    };

    const updateUserProfile = (name, photoURL) => {
        return updateProfile(auth.currentUser, {
            displayName: name, 
            photoURL: photoURL
        });
    };
    
    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };

    // ৪. ব্যবহারকারীর লগইন অবস্থা পর্যবেক্ষণের জন্য useEffect
    // এখন এর কাজ শুধু user এবং loading স্টেট আপডেট করা
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            console.log('Currently logged in user:', currentUser);
            setLoading(false);
        });

        // কম্পোনেন্ট আনমাউন্ট হলে পর্যবেক্ষকটিকে বন্ধ করা হয়
        return () => {
            return unsubscribe();
        };
    }, []);

    // ৫. কনটেক্সটের মাধ্যমে এই সব তথ্য এবং ফাংশন পাঠানো হচ্ছে
    const authInfo = {
        user,
        loading,
        createUser,
        signIn,
        googleSignIn,
        updateUserProfile,
        logOut
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;