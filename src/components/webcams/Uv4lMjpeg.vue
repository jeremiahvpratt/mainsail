<style scoped>
.webcamImage {
    width: 100%;
    background: lightgray;
}
</style>

<template>
    <img
        ref="webcamUv4lMjpegImage"
        v-observe-visibility="viewportVisibilityChanged"
        :style="webcamStyle"
        class="webcamImage"
        @load="onload" />
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import { GuiWebcamStateWebcam } from '@/store/gui/webcams/types'

@Component
export default class Uv4lMjpeg extends Mixins(BaseMixin) {
    private aspectRatio: null | number = null
    private isVisible = false
    private isVisibleViewport = false
    private isVisibleDocument = true

    @Prop({ required: true }) declare readonly camSettings: GuiWebcamStateWebcam
    @Prop() declare printerUrl: string | undefined

    declare $refs: {
        webcamUv4lMjpegImage: HTMLImageElement
    }

    get url() {
        const baseUrl = this.camSettings.urlStream
        let url = new URL(baseUrl, this.printerUrl === undefined ? this.hostUrl.toString() : this.printerUrl)
        if (baseUrl.startsWith('http') || baseUrl.startsWith('://')) url = new URL(baseUrl)

        return decodeURIComponent(url.toString())
    }

    get webcamStyle() {
        const output = {
            transform: 'none',
            aspectRatio: 16 / 9,
        }

        let transforms = ''
        if ('flipX' in this.camSettings && this.camSettings.flipX) transforms += ' scaleX(-1)'
        if ('flipX' in this.camSettings && this.camSettings.flipY) transforms += ' scaleY(-1)'
        if (transforms.trimStart().length) output.transform = transforms.trimStart()

        if (this.aspectRatio) output.aspectRatio = this.aspectRatio

        return output
    }

    mounted() {
        document.addEventListener('visibilitychange', this.documentVisibilityChanged)
    }

    beforeDestroy() {
        document.removeEventListener('visibilitychange', this.documentVisibilityChanged)
        this.stopStream()
    }

    startStream() {
        if (this.isVisible) return

        if (this.$refs.webcamUv4lMjpegImage) this.$refs.webcamUv4lMjpegImage.setAttribute('src', this.url)
    }

    stopStream() {
        if (this.$refs.webcamUv4lMjpegImage) {
            this.$refs.webcamUv4lMjpegImage.removeAttribute('src')
            URL.revokeObjectURL(this.url)
        }
    }

    // this function checks if the browser tab was changed
    documentVisibilityChanged() {
        const visibility = document.visibilityState
        this.isVisibleDocument = visibility === 'visible'
        if (!this.isVisibleDocument) this.stopStream()
        this.visibilityChanged()
    }

    // this function checks if the webcam is in the viewport
    viewportVisibilityChanged(newVal: boolean) {
        this.isVisibleViewport = newVal
        this.visibilityChanged()
    }

    visibilityChanged() {
        if (this.isVisibleViewport && this.isVisibleDocument) {
            this.startStream()
            return
        }

        this.stopStream()
    }

    onload() {
        if (this.aspectRatio === null && this.$refs.webcamUv4lMjpegImage) {
            this.aspectRatio =
                this.$refs.webcamUv4lMjpegImage.naturalWidth / this.$refs.webcamUv4lMjpegImage.naturalHeight
        }
    }

    @Watch('url')
    async urlChanged() {
        await this.stopStream()
        await this.startStream()
    }
}
</script>
