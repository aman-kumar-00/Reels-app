import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';

import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ListViewToken,
} from 'react-native';

import Video from 'react-native-video';
import {useFocusEffect} from '@react-navigation/native';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} =
  Dimensions.get('window');

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

const ForYou = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  // ==========================================
  // FETCH REELS FROM BACKEND
  // ==========================================
useFocusEffect(
  useCallback(() => {
    const fetchReels = async () => {
      try {
        setLoading(true);
        setError('');

        console.log('Fetching latest reels...');

        const response = await fetch(
          `${BACKEND_URL}/api/reels`,
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch reels: ${response.status}`,
          );
        }

        const result =
          (await response.json()) as ReelsResponse;

        console.log(
          'LATEST REELS:',
          result,
        );

        if (!result.success) {
          throw new Error(
            result.message ||
              'Failed to fetch reels',
          );
        }

        setReels(result.data || []);
        setActiveIndex(0);
        setIsPlaying(true);
      } catch (err) {
        console.error(
          'FETCH REELS ERROR:',
          err,
        );

        setError(
          `Failed to load reels:\n${String(err)}`,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, []),
);

  // ==========================================
  // VIEWABILITY
  // ==========================================

  const onViewableItemsChanged = useRef(
    ({
      viewableItems,
    }: {
      viewableItems: ListViewToken[];
    }) => {
      const visibleItem = viewableItems.find(
        item => item.isViewable,
      );

      if (
        visibleItem?.index !== null &&
        visibleItem?.index !== undefined
      ) {
        console.log(
          'ACTIVE REEL:',
          visibleItem.index,
        );

        setActiveIndex(visibleItem.index);

        // Automatically play new reel
        setIsPlaying(true);
      }
    },
  ).current;

  // ==========================================
  // RENDER REEL
  // ==========================================

  const renderReel = ({
    item,
    index,
  }: {
    item: Reel;
    index: number;
  }) => {
    const isActive = index === activeIndex;

    return (
      <View style={styles.reel}>
        {/* Only mount the active video */}
        {isActive && (
          <Video
            source={{
              uri: item.videoUrl,
            }}
            style={styles.video}
            resizeMode="cover"
            repeat={true}
            paused={!isPlaying}
            muted={true}
            useTextureView={true}
            onLoad={() => {
              console.log(
                'VIDEO LOADED:',
                item._id,
              );
            }}
            onError={error => {
              console.log(
                'VIDEO ERROR:',
                item._id,
                error,
              );
            }}
            onEnd={() => {
              console.log(
                'VIDEO ENDED:',
                item._id,
              );
            }}
          />
        )}

        {/* Dark overlay */}
        <View
          pointerEvents="none"
          style={styles.overlay}
        />

        {/* Video tap area */}
        {isActive && (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.videoTouchArea}
            onPress={() => {
              console.log('VIDEO TAP');

              setIsPlaying(previous => {
                console.log(
                  'PLAY STATE:',
                  !previous,
                );

                return !previous;
              });
            }}
          />
        )}

        {/* Play button */}
        {isActive && !isPlaying && (
          <View
            pointerEvents="none"
            style={styles.playButton}>
            <Text style={styles.playIcon}>
              ▶
            </Text>
          </View>
        )}

        {/* Right side actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}>
            <Text style={styles.action}>
              ♡
            </Text>

            <Text style={styles.actionText}>
              {item.likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}>
            <Text style={styles.action}>
              💬
            </Text>

            <Text style={styles.actionText}>
              Comment
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}>
            <Text style={styles.action}>
              ↗
            </Text>

            <Text style={styles.actionText}>
              Share
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}>
            <Text style={styles.action}>
              ⋮
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reel information */}
        <View style={styles.info}>
          <Text style={styles.username}>
            @reelsapp
          </Text>

          <Text style={styles.caption}>
            {item.description ||
              item.title}
          </Text>

          <Text style={styles.audio}>
            🎵 Original audio
          </Text>
        </View>
      </View>
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.centerText}>
          Loading reels...
        </Text>
      </View>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          {error}
        </Text>
      </View>
    );
  }

  // ==========================================
  // NO REELS
  // ==========================================

  if (reels.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.centerText}>
          No reels available.
        </Text>
      </View>
    );
  }

  // ==========================================
  // REELS FEED
  // ==========================================

  return (
    <View style={styles.container}>
      <FlatList
        data={reels}
        renderItem={renderReel}
        keyExtractor={item => item._id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        onViewableItemsChanged={
          onViewableItemsChanged
        }
        viewabilityConfig={
          viewabilityConfig
        }

        // Memory optimization
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={3}

        // Keep false for native video rendering
        removeClippedSubviews={false}

        getItemLayout={(_, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
      />
    </View>
  );
};

export default ForYou;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  centerContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  centerText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },

  errorText: {
    color: '#ff4444',
    fontSize: 14,
    textAlign: 'center',
  },

  reel: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    backgroundColor: '#000',
    position: 'relative',
  },

  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor:
      'rgba(0,0,0,0.15)',
  },

  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 70,
    height: 70,
    marginLeft: -35,
    marginTop: -35,
    borderRadius: 35,
    backgroundColor:
      'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  playIcon: {
    color: '#fff',
    fontSize: 30,
    marginLeft: 4,
  },

  actions: {
    position: 'absolute',
    right: 15,
    bottom: 150,
    alignItems: 'center',
  },

  actionButton: {
    alignItems: 'center',
    marginBottom: 22,
  },

  action: {
    fontSize: 32,
    color: '#fff',
  },

  actionText: {
    fontSize: 11,
    color: '#fff',
    marginTop: 3,
  },

  info: {
    position: 'absolute',
    left: 15,
    right: 90,
    bottom: 40,
  },

  username: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },

  caption: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },

  audio: {
    color: '#fff',
    fontSize: 13,
  },

  videoTouchArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
});