param(
  [string]$InputPath = "assets/images/v2/hero-infrastructure.png",
  [string]$OutputPath = "assets/images/v2/hero-infrastructure-animated.gif"
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName PresentationCore

$width = 768
$height = 512
$frameCount = 24
$frameDelay = 8

$source = [System.Drawing.Image]::FromFile((Resolve-Path $InputPath))
$base = [System.Drawing.Bitmap]::new($width, $height)
$baseGraphics = [System.Drawing.Graphics]::FromImage($base)
$baseGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$baseGraphics.DrawImage($source, 0, 0, $width, $height)
$baseGraphics.Dispose()
$source.Dispose()

$routes = @(
  @(@(382, 77), @(465, 92), @(528, 126), @(625, 133), @(708, 108)),
  @(@(326, 145), @(405, 171), @(472, 218), @(520, 283), @(558, 359)),
  @(@(483, 112), @(535, 167), @(575, 238), @(634, 300), @(694, 371))
)

function Get-RoutePoint($route, [double]$progress) {
  $scaled = $progress * ($route.Count - 1)
  $segment = [Math]::Min([Math]::Floor($scaled), $route.Count - 2)
  $local = $scaled - $segment
  $x = $route[$segment][0] + (($route[$segment + 1][0] - $route[$segment][0]) * $local)
  $y = $route[$segment][1] + (($route[$segment + 1][1] - $route[$segment][1]) * $local)
  return @($x, $y)
}

$encoder = [System.Windows.Media.Imaging.GifBitmapEncoder]::new()

for ($frameIndex = 0; $frameIndex -lt $frameCount; $frameIndex++) {
  $frame = $base.Clone()
  $graphics = [System.Drawing.Graphics]::FromImage($frame)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

  for ($routeIndex = 0; $routeIndex -lt $routes.Count; $routeIndex++) {
    $progress = (($frameIndex / $frameCount) + ($routeIndex * 0.27)) % 1
    $point = Get-RoutePoint $routes[$routeIndex] $progress

    $outer = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(35, 34, 211, 238))
    $middle = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(100, 63, 145, 255))
    $core = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(235, 190, 244, 255))
    $graphics.FillEllipse($outer, [float]($point[0] - 10), [float]($point[1] - 10), 20, 20)
    $graphics.FillEllipse($middle, [float]($point[0] - 5), [float]($point[1] - 5), 10, 10)
    $graphics.FillEllipse($core, [float]($point[0] - 2), [float]($point[1] - 2), 4, 4)
    $outer.Dispose()
    $middle.Dispose()
    $core.Dispose()
  }

  $graphics.Dispose()
  $stream = [System.IO.MemoryStream]::new()
  $frame.Save($stream, [System.Drawing.Imaging.ImageFormat]::Png)
  $frame.Dispose()
  $stream.Position = 0

  $decoder = [System.Windows.Media.Imaging.PngBitmapDecoder]::new(
    $stream,
    [System.Windows.Media.Imaging.BitmapCreateOptions]::PreservePixelFormat,
    [System.Windows.Media.Imaging.BitmapCacheOption]::OnLoad
  )
  $metadata = [System.Windows.Media.Imaging.BitmapMetadata]::new("gif")
  $metadata.SetQuery("/grctlext/Delay", [UInt16]$frameDelay)
  $metadata.SetQuery("/grctlext/Disposal", [byte]2)
  if ($frameIndex -eq 0) {
    $metadata.SetQuery("/appext/application", [byte[]](0x4E,0x45,0x54,0x53,0x43,0x41,0x50,0x45,0x32,0x2E,0x30))
    $metadata.SetQuery("/appext/data", [byte[]](0x03,0x01,0x00,0x00,0x00))
  }
  $encoder.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($decoder.Frames[0], $decoder.Frames[0].Thumbnail, $metadata, $decoder.Frames[0].ColorContexts))
  $stream.Dispose()
}

$base.Dispose()
$destination = [System.IO.Path]::GetFullPath($OutputPath)
$outputStream = [System.IO.File]::Open($destination, [System.IO.FileMode]::Create)
$encoder.Save($outputStream)
$outputStream.Dispose()
Write-Output $destination
