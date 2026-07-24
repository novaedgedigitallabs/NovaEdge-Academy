import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:youtube_player_flutter/youtube_player_flutter.dart';
import 'package:video_player/video_player.dart';
import 'package:chewie/chewie.dart';
import '../../../../core/theme/app_colors.dart';
import '../controllers/course_controller.dart';
import '../../data/models/lecture_model.dart';

class PlayerScreen extends ConsumerStatefulWidget {
  final String courseId;
  final int initialLectureIndex;

  const PlayerScreen({
    super.key,
    required this.courseId,
    this.initialLectureIndex = 0,
  });

  @override
  ConsumerState<PlayerScreen> createState() => _PlayerScreenState();
}

class _PlayerScreenState extends ConsumerState<PlayerScreen> {
  late int _currentLectureIndex;

  // Players
  YoutubePlayerController? _youtubeController;
  VideoPlayerController? _videoPlayerController;
  ChewieController? _chewieController;

  bool _isYoutube = false;
  bool _isLoadingVideo = true;

  @override
  void initState() {
    super.initState();
    _currentLectureIndex = widget.initialLectureIndex;
  }

  @override
  void dispose() {
    _youtubeController?.dispose();
    _chewieController?.dispose();
    _videoPlayerController?.dispose();
    super.dispose();
  }

  void _initPlayerForLecture(LectureModel lecture) async {
    // Dispose previous
    _youtubeController?.dispose();
    _youtubeController = null;
    _chewieController?.dispose();
    _chewieController = null;
    _videoPlayerController?.dispose();
    _videoPlayerController = null;

    setState(() => _isLoadingVideo = true);

    final url = lecture.videoUrl;
    final ytId = YoutubePlayer.convertUrlToId(url);

    if (ytId != null && ytId.isNotEmpty) {
      _isYoutube = true;
      _youtubeController = YoutubePlayerController(
        initialVideoId: ytId,
        flags: const YoutubePlayerFlags(
          autoPlay: true,
          mute: false,
        ),
      );
      setState(() => _isLoadingVideo = false);
    } else if (url.isNotEmpty) {
      _isYoutube = false;
      _videoPlayerController = VideoPlayerController.networkUrl(Uri.parse(url));
      await _videoPlayerController!.initialize();

      _chewieController = ChewieController(
        videoPlayerController: _videoPlayerController!,
        autoPlay: true,
        looping: false,
        aspectRatio: 16 / 9,
        materialProgressColors: ChewieProgressColors(
          playedColor: AppColors.primary500,
          handleColor: AppColors.primary400,
          backgroundColor: AppColors.bgElevated,
          bufferedColor: AppColors.borderStrong,
        ),
      );
      setState(() => _isLoadingVideo = false);
    } else {
      setState(() => _isLoadingVideo = false);
    }
  }

  void _saveProgress(LectureModel lecture) {
    int currentSec = 0;
    if (_isYoutube && _youtubeController != null) {
      currentSec = _youtubeController!.value.position.inSeconds;
    } else if (_videoPlayerController != null) {
      currentSec = _videoPlayerController!.value.position.inSeconds;
    }

    if (currentSec > 0) {
      ref.read(courseRepositoryProvider).updateProgress(
            courseId: widget.courseId,
            lectureId: lecture.id,
            lastPositionSec: currentSec,
            watchedDurationSec: currentSec,
            completed: currentSec > 60,
          );
    }
  }

  @override
  Widget build(BuildContext context) {
    final courseAsync = ref.watch(courseDetailProvider(widget.courseId));

    return Scaffold(
      backgroundColor: AppColors.bgBase,
      appBar: AppBar(
        backgroundColor: Colors.black,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () {
            context.pop();
          },
        ),
        title: const Text('Lecture Video', style: TextStyle(fontSize: 16)),
      ),
      body: courseAsync.when(
        loading: () => const Center(child: CircularProgressIndicator(color: AppColors.primary500)),
        error: (err, _) => Center(child: Text(err.toString(), style: const TextStyle(color: AppColors.error))),
        data: (course) {
          if (course.lectures.isEmpty) {
            return const Center(child: Text('No lectures available.', style: TextStyle(color: AppColors.text2)));
          }

          final currentLecture = course.lectures[_currentLectureIndex];

          if (_youtubeController == null && _chewieController == null && _isLoadingVideo) {
            WidgetsBinding.instance.addPostFrameCallback((_) {
              _initPlayerForLecture(currentLecture);
            });
          }

          return Column(
            children: [
              // Video Player Box
              Container(
                height: 220,
                color: Colors.black,
                child: _isLoadingVideo
                    ? const Center(child: CircularProgressIndicator(color: AppColors.primary500))
                    : _isYoutube && _youtubeController != null
                        ? YoutubePlayer(
                            controller: _youtubeController!,
                            showVideoProgressIndicator: true,
                            progressIndicatorColor: AppColors.primary500,
                          )
                        : _chewieController != null
                            ? Chewie(controller: _chewieController!)
                            : const Center(
                                child: Text('Video unavailable', style: TextStyle(color: Colors.white70)),
                              ),
              ),

              // Current Lecture Title & Info
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${_currentLectureIndex + 1}. ${currentLecture.title}',
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.text1),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      currentLecture.description,
                      maxLines: 3,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontSize: 13, color: AppColors.text2),
                    ),
                  ],
                ),
              ),

              const Divider(color: AppColors.borderDefault, height: 1),

              // Playlist / Lectures List
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Up Next in Course', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.text1)),
                    Text('${_currentLectureIndex + 1} of ${course.lectures.length}', style: const TextStyle(color: AppColors.text3, fontSize: 12)),
                  ],
                ),
              ),

              Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: course.lectures.length,
                  itemBuilder: (context, index) {
                    final lec = course.lectures[index];
                    final isPlaying = index == _currentLectureIndex;

                    return Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      decoration: BoxDecoration(
                        color: isPlaying ? AppColors.primary500.withOpacity(0.15) : AppColors.bgSurface,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isPlaying ? AppColors.primary500 : AppColors.borderDefault,
                        ),
                      ),
                      child: ListTile(
                        leading: CircleAvatar(
                          radius: 14,
                          backgroundColor: isPlaying ? AppColors.primary500 : AppColors.bgElevated,
                          child: Icon(
                            isPlaying ? Icons.play_arrow : Icons.videocam,
                            size: 16,
                            color: isPlaying ? Colors.white : AppColors.text3,
                          ),
                        ),
                        title: Text(
                          '${index + 1}. ${lec.title}',
                          style: TextStyle(
                            color: isPlaying ? AppColors.primary300 : AppColors.text1,
                            fontWeight: isPlaying ? FontWeight.bold : FontWeight.normal,
                            fontSize: 14,
                          ),
                        ),
                        subtitle: Text('${lec.duration} mins', style: const TextStyle(color: AppColors.text3, fontSize: 12)),
                        onTap: () {
                          _saveProgress(currentLecture);
                          setState(() {
                            _currentLectureIndex = index;
                          });
                          _initPlayerForLecture(course.lectures[index]);
                        },
                      ),
                    );
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
