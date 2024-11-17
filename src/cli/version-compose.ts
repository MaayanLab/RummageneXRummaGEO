import fs from 'fs'
import path from 'path'

let compose = fs.readFileSync(path.join(__dirname, '..', '..', 'docker-compose.yaml'), { encoding: 'utf-8' })
compose = compose.replaceAll(/maayanlab\/rummagenexrummageo:[\d\.]+/g, `maayanlab/rummagenexrummageo:${process.env.npm_package_version}`)
fs.writeFileSync(path.join(__dirname, '..', '..', 'docker-compose.yaml'), compose)
