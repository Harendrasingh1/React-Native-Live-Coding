import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { Text, View } from '@/components/Themed';
import { fetchJobs } from '@/services/JobService';
import { Job } from '@/types/job';
import JobCard from '@/components/JobCard';
import { FontAwesome } from '@expo/vector-icons';

export default function JobsScreen() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadJobs = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      setError(null);
      const response = await fetchJobs(1); // Always fetch page 1 for now
      
      // Make sure we have valid results
      if (response && response.results && Array.isArray(response.results)) {
        // Filter out jobs with undefined id
        const validJobs = response.results.filter(job => job && job.id !== undefined);
        
        // Ensure no duplicate jobs by using a Map with job.id as key
        const uniqueJobs = Array.from(
          new Map(validJobs.map(job => [job.id, job])).values()
        );
        
        setJobs(uniqueJobs);
      } else {
        console.error('Invalid API response format:', response);
        setError('Failed to load jobs. Invalid data received.');
        setJobs([]);
      }
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError('Failed to load jobs. Please try again.');
      setJobs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleRefresh = () => {
    loadJobs(true);
  };

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="briefcase" size={60} color="#ccc" />
      <Text style={styles.emptyText}>No jobs found</Text>
      <Text style={styles.emptySubText}>Pull down to refresh</Text>
    </View>
  );

  const ErrorComponent = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="exclamation-circle" size={60} color="#ff6b6b" />
      <Text style={styles.errorText}>{error}</Text>
      <Text style={styles.emptySubText}>Pull down to try again</Text>
    </View>
  );

  // Simplified rendering logic
  if (loading && !refreshing && jobs.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2f95dc" />
        <Text style={styles.loadingText}>Loading jobs...</Text>
      </View>
    );
  }

  if (error && jobs.length === 0) {
    return <ErrorComponent />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        renderItem={({ item }) => <JobCard job={item} />}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={jobs.length === 0 ? styles.listEmptyContainer : styles.listContainer}
        ListEmptyComponent={!loading && !refreshing ? EmptyComponent : null}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            colors={['#2f95dc']} 
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    paddingVertical: 8,
  },
  listEmptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#666',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#ff6b6b',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
