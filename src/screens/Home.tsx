import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

const BACKEND_URL = 'http://localhost:5000';

type Reel = {
  _id: string;
  title: string;
  videoUrl: string;
  publicId: string;
  description?: string;
  likes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
};

type ReelsResponse = {
  success: boolean;
  count: number;
  data: Reel[];
  message?: string;
};

// Convert Cloudinary video URL into a thumbnail URL
const getThumbnailUrl = (videoUrl: string) => {
  return videoUrl
    .replace(
      '/video/upload/',
      '/video/upload/so_0,w_600,h_850,c_fill/',
    )
    .replace(/\.[^/.]+$/, '.jpg');
};

const formatViews = (views: number) => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  }

  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }

  return String(views);
};

const Home = () => {
  const navigation = useNavigation<any>();

  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReels = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        `${BACKEND_URL}/api/reels`,
      );

      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status}`,
        );
      }

      const result =
        (await response.json()) as ReelsResponse;

      if (result.success) {
        setReels(result.data);
      } else {
        setError(
          result.message || 'Failed to load reels',
        );
      }
    } catch (err) {
      console.error('HOME REELS ERROR:', err);

      setError(
        'Unable to load reels. Check your backend connection.',
      );
    } finally {
      setLoading(false);
    }
  };

  // Refresh whenever Home tab is opened
  useFocusEffect(
    useCallback(() => {
      fetchReels();
    }, []),
  );

  // Open selected reel inside For You
  const openReel = (reelId: string) => {
    navigation.navigate('ForYou', {
      reelId: reelId,
    });
  };

  const renderReel = ({
    item,
  }: {
    item: Reel;
  }) => {
    const thumbnailUrl = getThumbnailUrl(
      item.videoUrl,
    );

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => openReel(item._id)}>

        {/* Thumbnail */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: thumbnailUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
          />

          {/* Play button */}
          <View
            pointerEvents="none"
            style={styles.playButton}>
            <Text style={styles.playIcon}>
              ▶
            </Text>
          </View>

          {/* Dubbed badge */}
          <View style={styles.dubbedBadge}>
            <Text style={styles.dubbedText}>
              Dubbed
            </Text>
          </View>

          {/* Views */}
          <View style={styles.viewsContainer}>
            <Text style={styles.viewsText}>
              🔥 {formatViews(item.views)}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text
          style={styles.title}
          numberOfLines={2}>
          {item.title}
        </Text>

        {/* Description / Tag */}
        {item.description ? (
          <View style={styles.tag}>
            <Text
              style={styles.tagText}
              numberOfLines={1}>
              {item.description}
            </Text>
          </View>
        ) : (
          <View style={styles.tag}>
            <Text style={styles.tagText}>
              Drama
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#ff3b30"
        />

        <Text style={styles.loadingText}>
          Loading reels...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error}
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchReels}>
          <Text style={styles.retryText}>
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Category */}
      <View style={styles.categoryRow}>
        <Text style={styles.activeCategory}>
          Drama
        </Text>

        <Text style={styles.category}>
          Anime
        </Text>
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        <View style={styles.activeFilter}>
          <Text style={styles.activeFilterText}>
            Popular
          </Text>
        </View>

        <View style={styles.filter}>
          <Text style={styles.filterText}>
            New
          </Text>
        </View>

        <View style={styles.filter}>
          <Text style={styles.filterText}>
            Coming Soon
          </Text>
        </View>

        <View style={styles.filter}>
          <Text style={styles.filterText}>
            Dubbed
          </Text>
        </View>
      </View>

      {/* Reel Grid */}
      <FlatList
        data={reels}
        keyExtractor={item => item._id}
        renderItem={renderReel}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.gridContent}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No reels available
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b090c',
    paddingTop: 15,
  },

  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
    gap: 30,
  },

  activeCategory: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '500',
    borderBottomWidth: 3,
    borderBottomColor: '#ffffff',
    paddingBottom: 5,
  },

  category: {
    color: '#999999',
    fontSize: 28,
    fontWeight: '500',
  },

  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
    gap: 10,
  },

  activeFilter: {
    backgroundColor: '#3a373b',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },

  filter: {
    backgroundColor: '#242125',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },

  activeFilterText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },

  filterText: {
    color: '#999999',
    fontSize: 15,
    fontWeight: 'bold',
  },

  gridContent: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },

  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  card: {
    width: '48.5%',
    backgroundColor: '#211f22',
    borderRadius: 12,
    overflow: 'hidden',
  },

  imageContainer: {
    width: '100%',
    aspectRatio: 0.72,
    position: 'relative',
  },

  thumbnail: {
    width: '100%',
    height: '100%',
  },

  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 50,
    height: 50,
    marginLeft: -25,
    marginTop: -25,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  playIcon: {
    color: '#ffffff',
    fontSize: 22,
    marginLeft: 3,
  },

  dubbedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ff3b30',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderBottomLeftRadius: 5,
  },

  dubbedText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },

  viewsContainer: {
    position: 'absolute',
    right: 7,
    bottom: 7,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },

  viewsText: {
    color: '#ffffff',
    fontSize: 12,
  },

  title: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '500',
    paddingHorizontal: 10,
    paddingTop: 8,
    lineHeight: 22,
  },

  tag: {
    alignSelf: 'flex-start',
    backgroundColor: '#4a474a',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 10,
    marginVertical: 8,
  },

  tagText: {
    color: '#dddddd',
    fontSize: 12,
  },

  center: {
    flex: 1,
    backgroundColor: '#0b090c',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  loadingText: {
    color: '#aaaaaa',
    marginTop: 10,
  },

  errorText: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 20,
  },

  retryButton: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
  },

  retryText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

  emptyContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 50,
  },

  emptyText: {
    color: '#888888',
    fontSize: 16,
  },
});