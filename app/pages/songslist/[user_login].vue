<script setup lang="ts">
const { user_login } = useRoute().params;

const { data: songslist } = await useFetch(`/api/spotify/songslist/${user_login}`);

if (!songslist.value) throw createError({ status: ErrorCode.NOT_FOUND, message: "Songs list not found", fatal: true });

const openTrack = (track_id: string) => {
  window.open(`https://open.spotify.com/track/${track_id}`, "_blank");
};
</script>

<template>
  <main v-if="songslist" class="py-4">
    <h1 class="mb-4">Songslist: @{{ user_login }}</h1>
    <div class="row flex-gap-1">
      <div class="col-lg-12">
        <div class="card rounded-4 border border-2 mb-3 overflow-hidden">
          <div class="card-header bg-primary">
            <p class="m-0 text-dark fw-bold">Currently playing</p>
          </div>
          <div class="card-body bg-body-secondary">
            <div v-if="songslist.currently_playing" class="d-flex p-3" role="button" @click="openTrack(songslist!.currently_playing!.track_id)">
              <img :src="songslist.currently_playing.image.url" alt="Album cover" class="rounded-4 shadow" style="width: 100px; height: 100px;">
              <div class="ms-3">
                <h2 class="m-0 text-body-emphasis">{{ songslist.currently_playing.track_name }}</h2>
                <p class="m-0">{{ songslist.currently_playing.track_artists }}</p>
              </div>
            </div>
            <div v-else class="d-flex p-3 h-100" style="height: 100px;">
              <div class="bg-body rounded-4 shadow" style="width: 100px; height: 100px;" />
              <div class="ms-3">
                <h2 class="m-0 text-body-emphasis">Nothing playing</h2>
              </div>
            </div>
          </div>
        </div>
        <div class="card border border-2 rounded-4 overflow-hidden">
          <div class="card-header bg-primary">
            <p class="m-0 text-dark fw-bold">Next in queue</p>
          </div>
          <div class="card-body p-0">
            <table class="table table-striped table-hover mb-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Artist</th>
                  <th>User</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="track in songslist?.list" :key="track.track_id">
                  <tr :class="{ 'table-success': track.playing }" role="button" @click="openTrack(track.track_id)">
                    <td>{{ track.track_name }}</td>
                    <td>{{ track.track_artists }}</td>
                    <td>{{ track.user_requested }}</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
