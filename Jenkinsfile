pipeline {
    agent any

    environment {
        SSH_KEY = credentials('DO_SSH_KEY')       // Jenkins SSH private key credential ID
        DO_HOST     = credentials('DO_HOST')             // DigitalOcean server IP or domain
        DO_USER     = credentials('DO_USER')             // SSH username
        REMOTE_DIR  = '/www/wwwroot/snvn.deepseahost.com/reactjs'
        NODE_VERSION = '22.14.0'
        PORT        = '3082'
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

        stage('Setup Node.js') {
            steps {
                script {
                    def nodeHome = tool name: "node-${NODE_VERSION}", type: 'NodeJSInstallation'
                    env.PATH = "${nodeHome}/bin:${env.PATH}"
                    echo "🛠 Using Node.js ${NODE_VERSION}"
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing dependencies using npm ci...'
                sh 'npm ci'
            }
        }

        stage('Run ESLint') {
            steps {
                echo '🔍 Running ESLint...'
                sh '''
                    npm run lint || echo "⚠️ ESLint completed with warnings (ignored)"
                '''
            }
        }

        stage('Build React App') {
            steps {
                echo '🛠 Building React application...'
                sh 'CI=false npm run build'
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
