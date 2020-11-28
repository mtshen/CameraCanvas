export default interface Interface {
  // 必填, canvas图层
  canvas: HTMLCanvasElement,
  // 视频图层, 如果不填会自动生成一个视频图层
  video?: HTMLVideoElement,
  // 高度, 视频图像高度, 不填写, 自动获取canvas图层高度
  height?: number,
  // 宽度, 视频图像宽度, 不填写, 自动获取canvas图层宽度
  width?: number,
  // Media设置参数集合
  mediaConf?: Object,
}
