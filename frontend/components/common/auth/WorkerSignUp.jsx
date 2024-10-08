import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../CustomButton";
import { Link } from "expo-router";
import { images } from "../../../constants";
import FormField from "../FormField";

const WorkerSignUp = () => {
  const [form, setForm] = useState({
    userType: "worker",
    name: "",
    email: "",
    username: "",
    password: "",
    location: "",
    age: "",
    category: "",
    hourlyRate: "",
    experience: "",
    socialLinks: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    setIsSubmitting(true);
    try {
      // Add your form submission logic here
      const response = await fetch('http://192.168.1.3:8080/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          userType: 'worker' // Specify user type as worker
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // Handle success (e.g., navigate to another screen)
        console.log(data.message);
      } else {
        // Handle error
        console.error(data.errors || data.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
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
            style={{ width: 80, height: 80, marginVertical: 24 }}
          />
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
            Register as a Worker
          </Text>
          <FormField
            title="Name"
            value={form.name}
            handleChangeText={(text) => setForm({ ...form, name: text })}
            style={{ marginBottom: 20 }}
          />
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(text) => setForm({ ...form, email: text })}
            style={{ marginBottom: 20 }}
            keyboardType="email-address"
          />
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(text) => setForm({ ...form, username: text })}
            style={{ marginBottom: 20 }}
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(text) => setForm({ ...form, password: text })}
            style={{ marginBottom: 20 }}
            secureTextEntry
          />
          <FormField
            title="Location"
            value={form.location}
            handleChangeText={(text) => setForm({ ...form, location: text })}
            style={{ marginBottom: 20 }}
          />
          <FormField
            title="Age"
            value={form.age}
            handleChangeText={(text) => setForm({ ...form, age: text })}
            style={{ marginBottom: 20 }}
            keyboardType="numeric"
          />
          <FormField
            title="Category"
            value={form.category}
            handleChangeText={(text) => setForm({ ...form, category: text })}
            style={{ marginBottom: 20 }}
          />
          <FormField
            title="Hourly Rate"
            value={form.hourlyRate}
            handleChangeText={(text) => setForm({ ...form, hourlyRate: text })}
            style={{ marginBottom: 20 }}
            keyboardType="numeric"
          />
          <FormField
            title="Experience (Years)"
            value={form.experience}
            handleChangeText={(text) => setForm({ ...form, experience: text })}
            style={{ marginBottom: 20 }}
            keyboardType="numeric"
          />
          <FormField
            title="Social Links (comma separated)"
            value={form.socialLinks}
            handleChangeText={(text) => setForm({ ...form, socialLinks: text })}
            style={{ marginBottom: 20 }}
          />
          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontSize: 16, color: '#737373' }}>
              Already have an account?
            </Text>
            <Link href="/sign-in" style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }} className='ml-2'>
                Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WorkerSignUp;