<template>
  <div>
    <!-- Hero Section -->
    <section style="background-color: #e8e8e8; padding: 80px 20px">
      <div class="container text-center">
        <div
          style="
            width: 400px;
            height: 200px;
            background-color: #d9d9d9;
            border-radius: 8px;
            margin: 0 auto 30px;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          <span style="font-size: 80px; color: #999">🎓</span>
        </div>
        <h1 style="font-size: 48px; font-weight: bold; margin-bottom: 15px">
          Student Marketplace
        </h1>
        <p style="font-size: 18px; color: #666; margin-bottom: 30px">
          Buy and sell safely within the Saskatchewan Polytechnic community
        </p>
        <div class="d-flex justify-content-center gap-3">
          <router-link
            to="/browse"
            class="btn btn-lg"
            style="
              background-color: white;
              color: black;
              border: 1px solid black;
              padding: 12px 40px;
            "
          >
            Browse Listing
          </router-link>
          <router-link
            to="/create-listing"
            class="btn btn-lg"
            style="background-color: #888; color: white; padding: 12px 40px"
          >
            Post an Item
          </router-link>
        </div>
      </div>
    </section>

    <!-- Shop by Category -->
    <section class="py-5" style="background-color: white">
      <div class="container">
        <h2 class="text-center mb-5" style="font-size: 32px; font-weight: bold">
          Shop by category
        </h2>
        <div class="row g-4">
          <div v-for="category in categories" :key="category.id" class="col-md-3">
            <div
              class="card"
              style="
                width: 301px;
                height: 399px;
                border: 1px solid black;
                border-radius: 0;
                box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
              "
            >
              <div
                style="
                  height: 183px;
                  background-color: #bfbdbd;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                <span style="font-size: 60px">📷</span>
              </div>
              <div style="padding: 25px; position: relative; height: 216px">
                <p style="font-size: 20px; margin-bottom: 10px">{{ category.label }}</p>
                <h3 style="font-size: 24px; font-weight: 600; margin-bottom: 15px">
                  {{ category.title }}
                </h3>
                <p style="font-size: 16px; color: #666; margin-bottom: 20px">
                  {{ category.description }}
                </p>
                <router-link
                  :to="`/browse?category=${category.slug}`"
                  style="font-size: 16px; color: black; text-decoration: none"
                >
                  {{ category.link }} →
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-5" style="background-color: #f5f5f5">
      <div class="container">
        <h2 class="text-center mb-5" style="font-size: 32px; font-weight: bold">
          How it works
        </h2>
        <div class="row g-4">
          <div v-for="step in steps" :key="step.number" class="col-md-3">
            <div
              class="card"
              style="
                width: 301px;
                height: 358px;
                border: 1px solid black;
                border-radius: 0;
                box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
                position: relative;
              "
            >
              <div style="padding: 25px; height: 175px">
                <p style="font-size: 16px; color: #888; margin-bottom: 10px">
                  {{ step.label }}
                </p>
                <h3 style="font-size: 24px; font-weight: 600; margin-bottom: 15px">
                  {{ step.title }}
                </h3>
                <p style="font-size: 16px; color: #666">{{ step.description }}</p>
              </div>
              <div
                style="
                  height: 183px;
                  background-color: #bfbdbd;
                  position: absolute;
                  bottom: 0;
                  width: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                <span style="font-size: 60px">📷</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const categories = ref([
  {
    id: 1,
    label: 'Textbooks and more',
    title: 'Textbooks',
    description: 'Find the right items for your campus life',
    link: 'View',
    slug: 'textbooks'
  },
  {
    id: 2,
    label: 'Tech for student (electronic)',
    title: 'Electronics',
    description: 'Discover affordable gadgets and tools',
    link: 'Explore',
    slug: 'electronics'
  },
  {
    id: 3,
    label: 'Dorm essentials (furniture)',
    title: 'Furniture',
    description: 'Comfortable living starts here',
    link: 'Browse',
    slug: 'furniture'
  },
  {
    id: 4,
    label: 'Campus fashion',
    title: 'Clothing',
    description: 'Style meets student budget',
    link: 'Shop',
    slug: 'clothing'
  }
]);

const steps = ref([
  {
    number: 1,
    label: 'step 1',
    title: 'Create Account',
    description: 'Sign up with your SaskPolytech email'
  },
  {
    number: 2,
    label: 'step 2',
    title: 'List Items',
    description: 'Post what you want to sell'
  },
  {
    number: 3,
    label: 'step 3',
    title: 'Connect',
    description: 'Message interested buyers'
  },
  {
    number: 4,
    label: 'step 4',
    title: 'Meet Safely',
    description: 'Use campus meetup locations'
  }
]);
</script>
