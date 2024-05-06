<script setup lang="ts">
const { user_login } = useRoute().params;

const { data: songslist } = useFetch(`/api/spotify/songslist/${user_login}`);
</script>

<template>
  <main class="py-4">
    <h1 class="mb-4">Songslist</h1>
    <div class="row flex-gap-1">
      <div class="col-lg-12">
        <div class="mb-2">
          <p>Currently playing</p>
          <div class="rounded-4 p-4 bg-body-secondary border border-2 d-flex" role="button">
            <img :src="songslist?.currently_playing.image.url" alt="Album cover" class="rounded-4 shadow" style="width: 100px; height: 100px;">
            <div class="ms-3">
              <h2 class="m-0">{{ songslist?.currently_playing.track_name }}</h2>
              <p class="m-0">{{ songslist?.currently_playing.track_artists }}</p>
            </div>
          </div>
        </div>
        <div>
          <p>Next in queue</p>
          <div class="border border-2 rounded-4 overflow-hidden">
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
                  <tr :class="{ 'table-success': track.playing }" role="button">
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
