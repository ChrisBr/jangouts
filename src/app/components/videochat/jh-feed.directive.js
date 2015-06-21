/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhFeed', jhFeed);

  jhFeed.$inject = ['RoomService'];

  function jhFeed(RoomService) {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/videochat/jh-feed.html',
      scope: {
        feed: '=',
        clickFn: '&',
        highlighted: '=',
        thumbVideos: '=',
        thumbVideosH: '='
      },
      controllerAs: 'vm',
      bindToController: true,
      controller: JhFeedCtrl,
      link: jhFeedLink,
    };

    function jhFeedLink(scope, element) {
      scope.$watch('vm.feed.stream', function(newVal) {
        if (newVal !== undefined) {
          var video = $('video', element)[0];
          // Mute video of the local stream
          video.muted = scope.vm.feed.isPublisher;
          scope.vm.updateVideoChannel();
          attachMediaStream(video, newVal);
        }
      });

      scope.$watch('vm.feed.speaking', function(newVal) {
        if (newVal !== undefined) {
          scope.vm.updateVideoChannel();
        }
      });

      scope.$watch('vm.thumbVideos', function(newVal) {
        if (newVal !== undefined) {
          scope.vm.updateVideoChannel();
        }
      });
    }

    function JhFeedCtrl() {
      /* jshint: validthis */
      var vm = this;
      vm.mirrored = (vm.feed.isPublisher && !vm.feed.isLocalScreen);
      vm.toggleAudio = toggleAudio;
      vm.toggleVideo = toggleVideo;
      vm.isVideoVisible = isVideoVisible;
      vm.showsEnableAudio = showsEnableAudio;
      vm.showsDisableAudio = showsDisableAudio;
      vm.showsAudioOff = showsAudioOff;
      vm.showsEnableVideo =showsEnableVideo;
      vm.showsDisableVideo = showsDisableVideo;
      vm.unPublish = unPublish;
      vm.showsUnPublish = showsUnPublish;
      vm.ignore = ignore;
      vm.stopIgnoring = stopIgnoring;
      vm.showsIgnore = showsIgnore;
      vm.showsStopIgnoring = showsStopIgnoring;
      vm.updateVideoChannel = updateVideoChannel;

      function toggleAudio() {
        RoomService.toggleChannel("audio", vm.feed);
      }

      function toggleVideo() {
        RoomService.toggleChannel("video", vm.feed);
      }

      function unPublish() {
        RoomService.unPublishFeed(vm.feed.id);
      }

      function showsUnPublish() {
        return (vm.feed.isPublisher && vm.feed.isLocalScreen);
      }

      function isVideoVisible() {
        var visible;

        visible = (!vm.feed.isIgnored && vm.feed.videoEnabled && vm.feed.hasVideo());
        if (visible && !vm.thumbVideosH) {
          visible = vm.feed.speaking;
        }
        return visible;
      }

      function showsEnableAudio() {
        return (vm.feed.isPublisher && vm.feed.hasAudio() && !vm.feed.audioEnabled);
      }

      function showsDisableAudio() {
        return (!vm.feed.isIgnored && vm.feed.audioEnabled && vm.feed.hasAudio());
      }

      function showsAudioOff() {
        return (!vm.feed.isPublisher && !vm.feed.isIgnored && vm.feed.hasAudio && vm.feed.hasAudio() && !vm.feed.audioEnabled);
      }

      function showsEnableVideo() {
        return (vm.feed.isPublisher && vm.feed.hasVideo() && !vm.feed.videoEnabled);
      }

      function showsDisableVideo() {
        return (vm.feed.isPublisher && vm.feed.hasVideo() && vm.feed.videoEnabled);
      }

      function ignore() {
        RoomService.ignoreFeed(vm.feed.id);
      }

      function showsIgnore() {
        return (!vm.feed.isPublisher && !vm.feed.isIgnored);
      }

      function stopIgnoring() {
        RoomService.stopIgnoringFeed(vm.feed.id);
      }

      function showsStopIgnoring() {
        return vm.feed.isIgnored;
      }

      function updateVideoChannel() {
        var enabled = vm.thumbVideos;
        if (!enabled) {
          enabled = vm.feed.speaking;
        }
        if (vm.feed.stream) {
          vm.feed.setEnabledTrack('video', enabled);
        }
      }
    }
  }
})();
