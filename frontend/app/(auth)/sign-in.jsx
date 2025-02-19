import { View, Text, ScrollView, Image, Alert } from "react-native";
import { React, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/common/CustomButton";
import { Link, router } from "expo-router";
import axios from "axios";
import { images } from "../../constants";
import FormField from "../../components/common/FormField";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import TestLogin from "./TestLogin";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(""); // Reset error message
  
    try {
        const response = await axios.post('http://192.168.1.3:8010/auth/signin', {
            username: form.email, // Use form.email for username
            password: form.password
        });
  
        console.log('Sign in response:', response.data);
      
        if (response.data.token) {
            await AsyncStorage.setItem('token', response.data.token);
            console.log('Token saved:', response.data.token);
            router.push(response.data.redirectUrl); // Default to /home if redirectUrl is not defined
        }
    } catch (error) {
        //console.error('Error signing in:', error.response ? error.response.data : error.message);
        setErrorMessage(error.response?.data?.message || "An unknown error occurred.");
    } finally {
        setIsSubmitting(false);
    }
};

  

  // Function to save user role to AsyncStorage and redirect
  const handleLogin = async (role) => {
    try {
      setIsSubmitting(true);
      await AsyncStorage.setItem("userRole", role);
      console.log(`User role saved: ${role}`); // Debugging line
      router.push(`(${role}-tabs)/home`);
    } catch (error) {
      console.error("Error saving user role:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="w-full justify-center h-full px-10 my-2">
          <Image
            source={images.logoSmall}
            resizeMode="contain"
            className="w-24 h-24 mx-auto my-12"
          />
          <Text className="text-2xl font-semibold -mt-4">
            Login to Fixr
          </Text>
          <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            secureTextEntry // This will hide the password input
          />
          {errorMessage ? (
            <Text className="text-red-500">{errorMessage}</Text>
          ) : null}
          <CustomButton
            title="Sign In"
            handlePress={handleSignIn}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <CustomButton
            title="Sign in as Client"
            handlePress={() => handleLogin("client")}
            containerStyles="mt-7 bg-black-900"
            isLoading={isSubmitting}
          />
          <CustomButton
            title="Sign in as Worker"
            handlePress={() => handleLogin("worker")}
            containerStyles="mt-4"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-400 font-medium">
              Don't have an account?
            </Text>
            <Link href="/sign-up" className="text-lg font-semibold text-black-600">
              Sign Up
            </Link>
          </View>
          <TestLogin />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
