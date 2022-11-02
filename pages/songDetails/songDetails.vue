<template>
  <view class="detailsBox">
    <text class="musicName">音乐名字</text>
    <!-- 旋转磁盘 -->
    <view class="portrait">
      <!-- 摇杆 -->
      <view class="rocker-box">
        <image
          :class="{ rockerAnimation }"
          class="rocker"
          src="../../static/song/needle.png"
        ></image>
        <view class="rocker-radius"></view>
      </view>
      <!-- 头像磁盘 -->
      <view class="bgImage">
        <image
          :class="{ diskAnimation }"
          class="bgImage-photo"
          src="../../static/image/nahatenahte.png"
          mode=""
        ></image>
      </view>
    </view>
    <!-- 音乐控件 -->
    <view class="music-tool">
      <!-- 进度 -->
      <view class="music-progress">
        <text class="progress-time">00:00</text>
        <text class="progress-line">
          <text class="progress-line-radius"></text>
        </text>
        <text class="progress-time">00:00</text>
      </view>
      <!-- 控件 -->
      <view class="music-controls">
        <!-- 播放模式 -->
        <text
          class="controls-same iconfont"
          :class="[playModelIcon[useModel]]"
          @click="handleMusicModel(useModel)"
        ></text>
        <!-- 上一首 -->
        <text class="controls-same iconfont icon-shangyishou_huaban"></text>
        <!-- 播放/暂停 -->
        <text class="controls-same iconfont icon-24gl-playCircle"></text>
        <!-- 下一首 -->
        <text class="controls-same iconfont icon-xiayishou_huaban"></text>
        <!-- 音乐列表 -->
        <text class="controls-same iconfont icon-bofangliebiao"></text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 摇杆动画
      rockerAnimation: false,
      // 磁盘动画
      diskAnimation: false,
      // 音乐播放模式 icon
      playModelIcon: [
        'icon-xunhuan',
        'icon-24gl-repeatOnce2',
        'icon-24gl-repeat2',
      ], //index 值 0 为随机 ； 1为单曲； 2为顺序；
      // 正在使用的播放模式（默认随机）
      useModel: 0,
    }
  },
  mounted() {},
  methods: {
    // 音乐播放模式切换
    handleMusicModel(index) {
      // index 值 0 为随机 ； 1为单曲； 2为顺序；
      this.useModel = index === this.playModelIcon.length - 1 ? 0 : index + 1
    },
  },
}
</script>

<style lang="less">
.detailsBox {
  display: flex;
  flex-direction: column;
  padding: 0 40rpx;
  height: 100%;
  background: #ddd;

  .musicName {
    margin: 20rpx auto;
    font-size: 40rpx;
  }

  .portrait {
    margin: 0 auto;
    margin-top: 100rpx;
    position: relative;

    .rocker-box {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-20%);

      .rocker {
        width: 170rpx;
        height: 300rpx;
        transform-origin: 0rpx 0rpx;
        transform: rotate(-12deg);
        transition: all 1s;
      }

      // 摇杆动画实现
      .rockerAnimation {
        transform: rotate(0deg);
        // animation: rockerAnimation 1s forwards;
      }

      .rocker-radius {
        width: 66rpx;
        height: 66rpx;
        background-color: #fff;
        border-radius: 33rpx;
        position: absolute;
        top: -30rpx;
        left: 5rpx;
      }
    }

    .bgImage {
      margin-top: 180rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 500rpx;
      height: 500rpx;
      background: url('/static/song/disc.png');
      background-size: cover;
      transition: all 1s;

      .bgImage-photo {
        width: 300rpx;
        height: 300rpx;
        border-radius: 150rpx;
      }
    }

    // 磁盘动画，旋转实现
    .diskAnimation {
      animation: diskAnimation 3s linear 1s infinite;
    }
  }

  .music-tool {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 100rpx 0;

    .music-progress {
      display: flex;
      justify-content: center;
      align-items: center;

      .progress-line {
        position: relative;
        top: 0;
        left: 0;
        width: 480rpx;
        margin: 0 10rpx;
        height: 4rpx;
        background-color: #999;

        .progress-line-radius {
          position: absolute;
          height: 4rpx;
          width: 200rpx;
          background: red;

          ::after {
            position: absolute;
            top: -50%;
            right: 0;
            content: '';
            width: 10rpx;
            height: 10rpx;
            border-radius: 5rpx;
            background: #fff;
          }
        }
      }
    }
  }

  // 播放控件
  .music-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 200rpx;

    .controls-same {
      font-size: 70rpx;
      color: #333;
    }

    // 播放/暂停
    .controls-play {
      width: 120rpx;
      height: 120rpx;
    }
  }
}

// 磁盘动画，旋转
@keyframes diskAnimation {
  100% {
    transform: rotate(360deg);
  }
}
</style>
