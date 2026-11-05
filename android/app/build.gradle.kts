plugins {
    id("com.android.application")
}

android {
    namespace = "com.rpgyacht.marinaempire"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.rpgyacht.marinaempire"
        minSdk = 24
        targetSdk = 36
        versionCode = 1
        versionName = "1.0.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

dependencies {
    implementation("com.google.androidbrowserhelper:androidbrowserhelper:2.7.4")
}
