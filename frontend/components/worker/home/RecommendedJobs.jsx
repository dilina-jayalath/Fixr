import RecommendedJobCard from "./RecommendedJobCard";
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';

const RecommendedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://192.168.1.3:8010/job/'); // Update with your API URL
      setJobs(response.data);
    } catch (err) {
      setError('Error fetching jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading) {
    return <ActivityIndicator color="#F59E2B" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View>
      {jobs.length > 0 ? (
        <FlatList
          data={jobs}
          keyExtractor={(job) => job._id}
          renderItem={({ item }) => <RecommendedJobCard job={item} />}
          contentContainerStyle={{columnGap:0}}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <Text>No jobs found</Text>
      )}
    </View>
  );
};

export default RecommendedJobs;
