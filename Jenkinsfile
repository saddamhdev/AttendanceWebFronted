pipeline {
    agent any

    environment {
        SSH_KEY     = credentials('DO_SSH_KEY')
        DO_HOST     = credentials('DO_HOST')
        DO_USER     = credentials('DO_USER')
        REMOTE_DIR  = '/www/wwwroot/CITSNVN/attendance/reactFronted'
        NODE_VERSION = '22.14.0'
        PORT        = '3082'
        NVM_DIR     = "${WORKSPACE}/.nvm"
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
                echo "📦 Installing Node.js ${NODE_VERSION} via NVM..."
                sh '''
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
                    npm run lint || echo "⚠️ ESLint completed with warnings (ignored)"
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
                echo '📦 Creating build archive...'
                sh 'tar czf build.tar.gz -C build .'
            }
        }

        stage('Deploy to Server') {
            when {
                expression { params.DEPLOY }
            }
            steps {
                script {
                    def remote = [
                        name: 'do-server',
                        host: "${DO_HOST}",
                        user: "${DO_USER}",
                        identityFile: "${SSH_KEY}",
                        allowAnyHosts: true
                    ]

                    try {
                        echo '🔐 Connecting and deploying to remote server...'

                        sshCommand remote: remote, command: """
                            echo '🔪 Killing process on port ${PORT}...'
                            PID=\$(lsof -t -i:${PORT})
                            if [ -n "\$PID" ]; then
                                kill -9 \$PID && echo '✅ Process killed.'
                            else
                                echo '⚠️ No process running.'
                            fi

                            cd ${REMOTE_DIR}
                            echo '📦 Backing up old build...'
                            rm -rf build.bak
                            mv build build.bak || echo 'No previous build found.'
                        """

                        echo '📤 Uploading build archive...'
                        sshPut remote: remote, from: 'build.tar.gz', into: "${REMOTE_DIR}/"

                        sshCommand remote: remote, command: """
                            cd ${REMOTE_DIR}
                            mkdir -p build
                            tar xzf build.tar.gz -C build
                            rm build.tar.gz
                            echo '✅ Build extracted.'
                        """

                        echo '🚀 Starting React app on port ${PORT}...'
                        sshCommand remote: remote, command: """
                            cd ${REMOTE_DIR}/build
                            nohup npx serve -s . -l ${PORT} > serve.log 2>&1 &
                            echo '✅ App started.'
                        """

                        echo '✅ Verifying deployment...'
                        sshCommand remote: remote, command: """
                            cd ${REMOTE_DIR}
                            if [ ! -d build ]; then
                                echo '❌ Deployment failed. Rolling back...'
                                mv build.bak build
                                echo '🔁 Rollback complete.'
                            else
                                echo '✅ Deployment successful.'
                            fi
                        """

                    } catch (Exception e) {
                        echo "❌ Deployment failed with error: ${e.message}"
                        currentBuild.result = 'FAILURE'
                    } finally {
                        echo '🧹 Cleaning up build archive...'
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
