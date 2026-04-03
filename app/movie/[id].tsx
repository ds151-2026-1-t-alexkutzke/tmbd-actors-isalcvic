import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { api } from '../../src/api/tmdb';
import React from 'react';

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [movie, setMovie] = useState<any>(null);
  const [atores, setAtores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const [movieRes, creditsRes] = await Promise.all([
          api.get(`/movie/${id}`),
          api.get(`/movie/${id}/credits`)
        ]);
        setMovie(movieRes.data);
        setAtores(creditsRes.data.cast);
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovieDetails();
  }, [id]);

  if (isLoading) return <ActivityIndicator size="large" color="#E50914" style={{ flex: 1 }} />;
  if (!movie) return <View style={styles.container}><Text style={{color: '#fff'}}>Erro ao carregar.</Text></View>;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}` }}
        style={styles.poster}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.title}>{movie?.title}</Text>
        <Text style={styles.overview}>{movie?.overview || 'Sinopse não disponível.'}</Text>

        <Text style={styles.sectionTitle}>Elenco Principal</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={atores}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/actor/${id}`)} style={styles.actorCard}>
              <Image
                source={item.profile_path
                  ? { uri: `https://image.tmdb.org/t/p/w200${item.profile_path}` }
                  : { uri: 'https://via.placeholder.com/150?text=Sem+Foto' }} 
                style={styles.actorImage}
              />
              <Text numberOfLines={1} style={styles.actorName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  poster: { width: '100%', height: 400, backgroundColor: '#333' },
  content: { padding: 20 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  overview: { color: '#ccc', fontSize: 14, lineHeight: 22, marginBottom: 20 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  actorCard: { marginRight: 15, alignItems: 'center', width: 80 },
  actorImage: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#333' },
  actorName: { color: '#fff', fontSize: 11, textAlign: 'center', marginTop: 5 },
});