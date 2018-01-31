<template>
  <div @click.stop>
    <div>测试google map</div>
    <div style="position: absolute;top: 20px;right: 20px;width: 60%;z-index: 2;">
      <GmapAutocomplete @place_changed="onChangePlace"></GmapAutocomplete>
    </div>

    <gmap-map
      :center="center"
      :zoom="14"
      @click="onClickMap"
      map-type-id="roadmap"
      style="position: absolute;top:0px;right: 0px;left: 0px;bottom: 0px;"
    >
      <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="true"
        @drag="onDrag"
        @click="clickLoc"
      >
        <gmap-info-window :opened="!!locationName">
          <div>{{locationName}}</div>
        </gmap-info-window>
      </gmap-marker>

    </gmap-map>
  </div>
</template>

<script>
  import Vue from 'vue'
  import * as VueGoogleMaps from 'vue2-google-maps'


  const key = "AIzaSyBzE9xAESye6Kde-3hT-6B90nfwUkcS8Yw";

  Vue.use(VueGoogleMaps, {
    load: {
      key: key, //'AIzaSyBvWE_sIwKbWkiuJQOf8gSk9qzpO96fhfY',
      libraries: 'places', // This is required if you use the Autocomplete plugin
      // OR: libraries: 'places,drawing'
      // OR: libraries: 'places,drawing,visualization'
      // (as you require)
    }
  });
  export default {
    data() {
      return {
        center: {lat: 10.0, lng: 10.0},
        markers: [{
          position: {lat: 10.0, lng: 10.0}
        }],
        locationName: ""
      }
    },

    methods: {
      clickLoc(v) {
        debugger;
        console.log(v);
      },
      onDrag(v) {
        console.log(v);
      },
      onClickMap(v) {
        console.log(v.latLng);
        var latLngData = v.latLng.lat().toFixed(6) + ',' + v.latLng.lng().toFixed(6);
        console.log(latLngData);
        //this.placeMarker(v.latLng);
        this.setLocation(v.latLng);
      },

      onChangePlace(v) {
        console.log(v);
        this.setLocation(v.geometry.location, v.formatted_address);
      },

      setLocation(location, locationName) {
        if (location) {
          this.markers = [{
            position: {lat: location.lat(), lng: location.lng()}
          }];
        }
        //this.center = this.markers[0].position;
        this.locationName = locationName || "";

        if (!locationName) {
          this.getLocationName(location);
        } else {
          this.center = this.markers[0].position;
        }
      },

      getLocationName(loc) {
        let latLngData = loc.lat().toFixed(6) + ',' + loc.lng().toFixed(6);
        $.ajax({
          type: "post",
          url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latLngData + "&language=zh-CN&sensor=false&location_typeaa=GEOMETRIC_CENTER&result_type=street_address&key=" + key,
          async: true,
          success: this.onLoadLocName
        });
      },

      onLoadLocName(res) {
        this.locationName = res.results[0] ? res.results[0].formatted_address : "";
      },

      placeMarker(location) {
        var marker = new google.maps.Marker({
          position: location,
          map: map,
        });
      }
//    var infowindow = new google.maps.InfoWindow({
//      content: 'Latitude: ' + location.lat() + '<br>Longitude: ' + location.lng()
//    });
//    infowindow.open(map,marker);


//  }
    }
  }
</script>
