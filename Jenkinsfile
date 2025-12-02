pipeline {
    agent any

    environment {
        SSH_USER     = credentials('DO_USER')          // Username only
        SSH_PASS     = credentials('DO_SSH_PASSWORD')  // Password only
        DO_HOST      = credentials('DO_HOST')          // Host only
        REMOTE_DIR   = '/www/wwwroot/CITSNVN/attendance/reactFronted'
        NODE_VERSION = '22.14.0'
        PORT         = '3082'
        NVM_DIR      = "${WORKSPACE}/.nvm"
    }

    parameters {
        booleanParam(name: 'DEPLOY', defaultValue: false, description: 'Deploy to server after build?')
    }

    options {
        timestamps()
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📥 Checking out source code...'
                checkout scm
            }
        }

        stage('Install Node.js via NVM') {
            steps {
                sh '''
                    echo "📦 Installing Node ${NODE_VERSION}..."
                    export NVM_DIR="${NVM_DIR}"
                    mkdir -p "$NVM_DIR"
                    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

                    . "$NVM_DIR/nvm.sh"
                    nvm install ${NODE_VERSION}
                    nvm use ${NODE_VERSION}
                    node -v
                    npm -v
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    . "${NVM_DIR}/nvm.sh"
                    nvm use ${NODE_VERSION}
                    npm ci
                '''
            }
        }

        stage('Run ESLint') {
            steps {
                sh '''
                    . "${NVM_DIR}/nvm.sh"
                    nvm use ${NODE_VERSION}
                    npm run lint || echo "⚠️ ESLint warnings ignored"
                '''
            }
        }

        stage('Build React App') {
            steps {
                sh '''
                    . "${NVM_DIR}/nvm.sh"
                    nvm use ${NODE_VERSION}
                    CI=false npm run build
                '''
            }
        }

        stage('Archive Build') {
            steps {
                echo '📦 Creating build.tar.gz...'
                sh 'tar czf build.tar.gz -C build .'
            }
        }

        stage('Deploy to Server') {
            when {
                expression { params.DEPLOY }
            }
            steps {
                script {
                    try {

                        echo "🔐 Connecting to server via SSH..."

                        // 🔪 Kill existing process
                        sh """
                            sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no $SSH_USER@$DO_HOST \
                            "lsof -t -i:${PORT} | xargs -r kill -9 || echo '⚠️ No running process found'"
                        """

                        // 🧹 Prepare remote directory
                        sh """
                            sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no $SSH_USER@$DO_HOST \
                            "cd ${REMOTE_DIR} && rm -rf build.bak && mv build build.bak 2>/dev/null || true"
                        """

                        // 📤 Upload build
                        echo "📤 Uploading build.tar.gz..."
                        sh """
                            sshpass -p "$SSH_PASS" scp -o StrictHostKeyChecking=no build.tar.gz \
                            $SSH_USER@$DO_HOST:${REMOTE_DIR}/
                        """

                        // 📦 Extract new build
                        sh """
                            sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no $SSH_USER@$DO_HOST \
                            "cd ${REMOTE_DIR} && mkdir -p build && tar xzf build.tar.gz -C build && rm build.tar.gz"
                        """

                        // 🚀 Start React App
                        sh """
                            sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no $SSH_USER@$DO_HOST \
                            "cd ${REMOTE_DIR}/build && nohup npx serve -s . -l ${PORT} > serve.log 2>&1 &"
                        """

                        // 🔍 Verify deployment
                        sh """
                            sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no $SSH_USER@$DO_HOST \
                            "cd ${REMOTE_DIR} && [ -d build ] && echo '✅ Deployment successful' || (echo '❌ Failed, rolling back...' && mv build.bak build)"
                        """

                    } catch (Exception e) {
                        echo "❌ Deployment failed: ${e.message}"
                        currentBuild.result = 'FAILURE'
                    } finally {
                        sh 'rm -f build.tar.gz'
                    }
                }
            }
        }
    }

    post {
        always {
            echo '📄 Pipeline execution finished.'
        }
    }
}
