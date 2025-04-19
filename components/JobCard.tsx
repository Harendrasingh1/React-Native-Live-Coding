import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { Text } from './Themed';
import { Job } from '@/types/job';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

type JobCardProps = {
  job: Job;
};

export default function JobCard({ job }: JobCardProps) {
  const handlePress = () => {
    router.push({
      pathname: '/jobDetails/[id]',
      params: { id: job.id, data: JSON.stringify(job) }
    });
  };

  const thumbImage = job.creatives?.length > 0
    ? { uri: job.creatives[0].thumb_url }
    : require('@/assets/images/placeholder.png');

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.cardContent}>
        <View style={styles.imageContainer}>
          <Image source={thumbImage} style={styles.image} resizeMode="cover" />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={2}>{job.title}</Text>

          <View style={styles.detailRow}>
            <FontAwesome name="building" size={14} color="#666" />
            <Text style={styles.detail}>{job.company_name}</Text>
          </View>

          <View style={styles.detailRow}>
            <FontAwesome name="map-marker" size={14} color="#666" />
            <Text style={styles.detail}>{job.primary_details.Place}</Text>
          </View>

          <View style={styles.detailRow}>
            <FontAwesome name="money" size={14} color="#666" />
            <Text style={styles.detail}>{job.primary_details.Salary}</Text>
          </View>

          <View style={styles.detailRow}>
            <FontAwesome name="phone" size={14} color="#666" />
            <Text style={styles.detail}>{job.whatsapp_no}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  detail: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
});