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
import app from '../firebase/firebase.config'; // আপনার ফায়ারবেস কনফিগারেশন ফাইল

// ১. কনটেক্সট তৈরি করা হলো
export const AuthContext = createContext(null);

// ফায়ারবেস থেকে auth অবজেক্ট নেওয়া হচ্ছে
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    // ২. ব্যবহারকারীর তথ্য এবং লোডিং অবস্থা রাখার জন্য দুটি স্টেট
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ৩. ফায়ারবেসের বিভিন্ন অথেনটিকেশন ফাংশনকে র‍্যাপ করে নতুন ফাংশন তৈরি করা
    
    // ইমেইল ও পাসওয়ার্ড দিয়ে নতুন ইউজার তৈরি
    const createUser = (email, password) => {
        setLoading(true); // কাজ শুরুর আগে লোডিং শুরু
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // ইমেইল ও পাসওয়ার্ড দিয়ে লগইন
    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    // গুগল দিয়ে লগইন
    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    // ব্যবহারকারীর প্রোফাইল (নাম এবং ছবি) আপডেট করা
    const updateUserProfile = (name, photoURL) => {
        return updateProfile(auth.currentUser, {
            displayName: name, 
            photoURL: photoURL
        });
    };

    // লগআউট
    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };

    // ৪. ব্যবহারকারীর লগইন অবস্থা পর্যবেক্ষণের জন্য useEffect
    // এটি পুরো অ্যাপ্লিকেশনের সবচেয়ে গুরুত্বপূর্ণ অংশগুলোর একটি
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            console.log('Current user state:', currentUser);
            setUser(currentUser); // ব্যবহারকারীর অবস্থা সেট করা হচ্ছে
            setLoading(false); // পর্যবেক্ষণ শেষ, তাই লোডিং বন্ধ
        });

        // কম্পোনেন্ট আনমাউন্ট হলে পর্যবেক্ষকটিকে বন্ধ করা হয় (মেমোরি লিক রোধ করতে)
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