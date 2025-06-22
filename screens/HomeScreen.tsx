import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [image, setImage] = useState<any>(null);
  const [calories, setCalories] = useState<number | null>(null);
  const [foodLabel, setFoodLabel] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (res) => {
      if (res.assets && res.assets.length > 0) {
        setImage(res.assets[0]);
        setCalories(null);
        setFoodLabel('');
      }
    });
  };

  const uploadImage = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('image', {
      uri: image.uri,
      name: image.fileName || 'photo.jpg',
      type: image.type || 'image/jpeg',
    } as any);

    setLoading(true);
    try {
      const response = await axios.post('http://192.168.1.102:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setCalories(response.data.calories);
      setFoodLabel(response.data.food);
    } catch (err) {
      Alert.alert('Error', 'Failed to upload or analyze image.');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🍽️ Calorie Tracker</Text>
      
      <Button title="📷 Select Image" onPress={pickImage} />

      {image && (
        <Image source={{ uri: image.uri }} style={styles.image} />
      )}

      {image && (
        <Button title="🚀 Upload & Analyze" onPress={uploadImage} />
      )}

      {loading && <ActivityIndicator size="large" style={{ marginTop: 10 }} />}

      {calories !== null && (
        <View style={styles.result}>
          <Text style={styles.resultText}>🍎 Food: {foodLabel}</Text>
          <Text style={styles.resultText}>🔥 Calories: {calories} kcal</Text>
        </View>
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="📋 View History" onPress={() => navigation.navigate('History')} />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    marginVertical: 15,
    borderRadius: 10,
  },
  result: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  resultText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
});
