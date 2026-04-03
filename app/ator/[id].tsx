import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { api } from '../../src/api/tmdb';
import React from 'react';

    export default function ActorDetailsScreen() { 
    const { id } = useLocalSearchParams();
    const router = useRouter();
    
    const [actor, setActor] = useState<any>(null);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActorData = async () => {
        try {
            const [detailsRes, creditsRes] = await Promise.all([
            api.get(`/person/${id}`),
            api.get(`/person/${id}/movie_credits`)
            ]);
            setActor(detailsRes.data);
            setMovies(creditsRes.data.cast);
        } catch (error) {
            console.error("Erro ao buscar dados do ator:", error);
        } finally {
            setLoading(false);
        }
        };
        fetchActorData();
    }, [id]);

    if (loading) return <ActivityIndicator size="large" color="#E50914" style={{ flex: 1 }} />;

    return (
        <ScrollView style={styles.container}>
        <Image
            source={actor?.profile_path 
            ? { uri: `https://image.tmdb.org/t/p/w500${actor.profile_path}` }
            : { uri: 'https://via.placeholder.com/500x750?text=Sem+Foto' }} 
            style={styles.portrait} 
        />
        
        <Text style={styles.name}>{actor?.name}</Text>
        <Text style={styles.bio}>{actor?.biography || "Biografia não disponível."}</Text>

        <Text style={styles.subtitle}>Filmografia</Text>
        <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={movies}
            keyExtractor={(item) => item.id.toString() + Math.random()}
            renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/movie/${item.id}`)} style={styles.movieCard}>
                <Image
                source={item.poster_path 
                    ? { uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }
                    : { uri: 'https://via.placeholder.com/200x300?text=Sem+Poster' }} 
                style={styles.moviePoster}
                />
                <Text numberOfLines={2} style={styles.movieTitle}>{item.title}</Text>
            </TouchableOpacity>
            )}
        />
        </ScrollView>
    );
    }

    const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', padding: 10 },
    portrait: { width: '100%', height: 450, borderRadius: 10, backgroundColor: '#333' },
    name: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
    bio: { color: '#ccc', fontSize: 14, lineHeight: 20, marginBottom: 20 },
    subtitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    movieCard: { marginRight: 12, width: 100 },
    moviePoster: { width: 100, height: 150, borderRadius: 8, backgroundColor: '#333' },
    movieTitle: { color: '#fff', fontSize: 11, marginTop: 5, textAlign: 'center' }
    });