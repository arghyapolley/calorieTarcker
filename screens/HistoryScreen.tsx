import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import axios from 'axios';

interface LogEntry {
  _id: string;
  image: string;
  calories: number;
  createdAt: string;
}

const HistoryScreen = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const fetchLogs = async () => {
    try {
        const res = await axios.get('http://192.168.1.102:5000/api/logs');
      setLogs(res.data);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📋 History</Text>
      <FlatList
        data={logs}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: `http://<YOUR_LOCAL_IP>:5000/${item.image}` }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.text}>🔥 {item.calories} kcal</Text>
              <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  card: { flexDirection: 'row', marginBottom: 15, borderWidth: 1, borderRadius: 10, overflow: 'hidden' },
  image: { width: 100, height: 100 },
  info: { flex: 1, padding: 10 },
  text: { fontSize: 18, fontWeight: 'bold' },
  date: { fontSize: 14, color: 'gray' },
});
