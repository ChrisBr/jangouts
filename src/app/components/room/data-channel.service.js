(function () {
  'use strict';

  angular.module('janusHangouts')
    .service('DataChannelService', DataChannelService);

  DataChannelService.$inject = ['$timeout', 'FeedsService', 'LogEntry', 'LogService'];

  function DataChannelService($timeout, FeedsService, LogEntry, LogService) {
    this.sendStatus = sendStatus;
    this.sendMuteRequest = sendMuteRequest;
    this.sendChatMessage = sendChatMessage;
    this.receiveMessage = receiveMessage;

    function receiveMessage(data, remoteId) {
      var $$timeout = $timeout;
      var msg = JSON.parse(data);
      var type = msg.type;
      var content = msg.content;

      if (type === "chatMsg") {
        var entry = new LogEntry("chatMsg", {feed: FeedsService.find(remoteId), text: content});
        $$timeout(function () {
          LogService.add(entry);
        });
      } else if (type === "muteRequest") {
        var feed = FeedsService.find(content.target);
        if (feed.isPublisher) {
          feed.setEnabledTrack("audio", false);
        }
      } else if (type === "statusUpdate") {
        var feed = FeedsService.find(content.source);
        if (feed && !feed.isPublisher) {
          feed.setStatus(content.status);
        }
      } else {
        console.log("Unknown data type: " + type);
      }
    }

    function sendMuteRequest(feed) {
      var content = {
        target: feed.id,
      };

      sendMessage("muteRequest", content);
    }

    function sendStatus(feed) {
      var content = {
        source: feed.id,
        status: feed.getStatus()
      };

      sendMessage("statusUpdate", content);
    }

    function sendChatMessage(text) {
      sendMessage("chatMsg", text);
    }

    function sendMessage(type, content) {
      var text = JSON.stringify({
        type: type,
        content: content
      });
      var mainFeed = FeedsService.findMain();
      if (mainFeed === null) { return; }
      if (!mainFeed.isDataOpen) {
        console.log("Data channel not open yet. Skipping");
        return;
      }
      var handle = mainFeed.pluginHandle;
      handle.data({
        text: text,
        error: function(reason) { alert(reason); },
        success: function() { console.log("Data sent: " + type); }
      });
    }
  }
}());
