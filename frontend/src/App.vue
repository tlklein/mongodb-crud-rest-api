<!-- This is the main frontend file. It displays a navigation bar and rendered components. -->
<template>
  <main class="flex flex-row">
    <div id="_container" class="min-h-screen">
      <header class="w-full">
        <section class="text-center">
          <img class="m-auto" src="@\assets\DanPersona.svg" />
        </section>
        <!--Navigation bar-->
        <nav class="mt-10">
          <ul class="flex flex-col gap-4">
            <!-- Dashboard link -->
            <li>
              <router-link to="/">
                <span style="position: relative; top: 6px" class="material-icons">dashboard</span>
                Dashboard
              </router-link>
            </li>
            <!--Login link - Link only shows if user is logged out-->
            <li v-if="!user.isLoggedIn">
              <router-link to="/login">
                <span style="position:relative; top: 6px" class="material-icons">login</span>
                Login
              </router-link>
            </li>
            <!--Logout link - Link only shows if user is logged in-->
            <li v-if="user.isLoggedIn" @click.prevent="logout" style="cursor: pointer;">
              <span style="position:relative; top: 6px" class="material-icons">logout</span>
              Logout
            </li>
            <!--Client Intake Form link - only shows if user is an editor-->
            <li v-if="user.role === 'editor'">
              <router-link to="/clientform">
                <span style="position: relative; top: 6px" class="material-icons">people</span>
                Client Intake Form
              </router-link>
            </li>
            <!--
            <li v-if="user.role === 'editor'">
              <router-link to="/clientdetails">
                <span style="position: relative; top: 6px" class="material-icons">people</span>
                Manage Client
              </router-link>
            </li>
            -->
            <!--Create Event link - only shows if user is an editor-->
            <li v-if="user.role === 'editor'">
              <router-link to="/eventform">
                <span style="position: relative; top: 6px" class="material-icons">event</span>
                Create Event
              </router-link>
            </li>
<!--
            <li v-if="user.role === 'editor'">
              <router-link to="/eventDetails">
                <span style="position: relative; top: 6px" class="material-icons">event</span>
                Manage Event
              </router-link>
            </li>
-->

            <!--Create Service link - only shows if user is an editor-->
            <li v-if="user.role === 'editor'">
              <router-link to="/serviceform">
                <span style="position: relative; top: 6px" class="material-icons">volunteer_activism</span>
                Create Service
              </router-link>
            </li>
<!--
            <li v-if="user.role === 'editor'">
              <router-link to="/servicedetails">
                <span style="position: relative; top: 6px" class="material-icons">volunteer_activism</span>
                Manage Service
              </router-link>
            </li>
          -->
            <!--Find Client link - only shows if user is logged in-->
            <li v-if="user.isLoggedIn">
              <router-link to="/findclient">
                <span style="position: relative; top: 6px" class="material-icons">search</span>
                Find Client
              </router-link>
            </li>
            <!--Find Event link - only shows if user is logged in-->
            <li v-if="user.isLoggedIn">
              <router-link to="/findevents">
                <span style="position: relative; top: 6px" class="material-icons">search</span>
                Find Event
              </router-link>
            </li>
            <!--Find Service link - only shows if user is logged in-->
            <li v-if="user.isLoggedIn">
              <router-link to="/findservice">
                <span style="position: relative; top: 6px" class="material-icons">search</span>
                Find Service
              </router-link>
            </li>
          </ul>
          <Toast /> <!--fix blank message error-->
        </nav>
      </header>
    </div>
    <div class="grow w-4/5">
      <!--Organization Name Header-->
      <section class="justify-end items-center h-24 flex"
        style="background: linear-gradient(250deg, #c8102e 70%, #efecec 50.6%)">
        <!-- Gets org name data-->
        <h1 class="mr-20 text-3xl text-white"> {{ orgName.name }}</h1> 
      </section>
      <!--Page Content-->
      <div>
        <router-view></router-view>
      </div>
    </div>
  </main>
</template>

<script>
import { ref } from 'vue';
import { useLoggedInUserStore } from './store/loggedInUser';
import { getOrgName } from './api/api';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

export default {
  setup() {
  const user = useLoggedInUserStore();
  const orgName = ref("Dataplatform");
  const toast = useToast();
  const router = useRouter();

  const logout = async () => {
    try {
      await user.logout();
      // toast.info("You have been logged out!");
      router.push('/');
    } catch (error) {
      toast.error('Logout error: ' + error.message);
    }
  };

  const fetchData = async () => {
    try {
      orgName.value = await getOrgName();
    } catch (error) {
      throw error;
    }
  };

  fetchData();

  return {
    user,
    orgName,
    logout
  };
}

}
</script>

<style scoped>
#_container {
  background-color: #c8102e;
  color: white;
  padding: 18px;
}
</style>