import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

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

const getThumbnailUrl = (videoUrl: string) => {
  return videoUrl
    .replace(
      '/video/upload/',
      '/video/upload/so_0,w_400,h_600,c_fill/',
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

const MyList = () => {
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
      console.error('MY LIST ERROR:', err);

      setError(
        'Unable to load reels. Check your backend connection.',
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchReels();
    }, []),
  );

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
        activeOpacity={0.9}>

        <View style={styles.imageContainer}>
          <Image
            source={{uri: thumbnailUrl}}
            style={styles.thumbnail}
            resizeMode="cover"
          />

          <View style={styles.dubbedBadge}>
            <Text style={styles.dubbedText}>
              Dubbed
            </Text>
          </View>

          <View style={styles.viewsContainer}>
            <Text style={styles.viewsText}>
              🔥 {formatViews(item.views)}
            </Text>
          </View>
        </View>

        <Text
          style={styles.title}
          numberOfLines={1}>
          {item.title}
        </Text>

        <Text style={styles.episode}>
          EP.1
        </Text>
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
          Loading your list...
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

      {/* Top tabs */}
      <View style={styles.topTabs}>
        <Text style={styles.topTab}>
          Following
        </Text>

        <Text style={styles.topTab}>
          History
        </Text>

        <Text style={styles.activeTopTab}>
          Like
        </Text>
      </View>

      {/* Categories */}
      <View style={styles.categoryRow}>
        <View style={styles.activeCategoryBox}>
          <Text style={styles.activeCategory}>
            Drama
          </Text>
        </View>

        <View style={styles.categoryBox}>
          <Text style={styles.category}>
            Anime
          </Text>
        </View>
      </View>

      {/* Grid */}
      <FlatList
        data={reels}
        keyExtractor={item => item._id}
        renderItem={renderReel}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.gridContent}
        initialNumToRender={9}
        maxToRenderPerBatch={9}
        windowSize={5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No reels in your list
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default MyList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b090c',
    paddingTop: 15,
  },

  topTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 30,
    marginBottom: 18,
  },

  topTab: {
    color: '#777777',
    fontSize: 24,
  },

  activeTopTab: {
    color: '#ffffff',
    fontSize: 24,
    borderBottomWidth: 3,
    borderBottomColor: '#ffffff',
    paddingBottom: 5,
  },

  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 15,
  },

  activeCategoryBox: {
    backgroundColor: '#39363a',
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 8,
  },

  categoryBox: {
    backgroundColor: '#252226',
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 8,
  },

  activeCategory: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  category: {
    color: '#999999',
    fontSize: 17,
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
    width: '31.5%',
  },

  imageContainer: {
    width: '100%',
    aspectRatio: 0.68,
    borderRadius: 9,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#222222',
  },

  thumbnail: {
    width: '100%',
    height: '100%',
  },

  dubbedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ff3b30',
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderBottomLeftRadius: 4,
  },

  dubbedText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '500',
  },

  viewsContainer: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },

  viewsText: {
    color: '#ffffff',
    fontSize: 9,
  },

  title: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 6,
  },

  episode: {
    color: '#aaaaaa',
    fontSize: 12,
    marginTop: 4,
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