import styles from './styles.module.css'

export default async function Home() {
  return (
    <section className={styles.wrapper}>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </section>
  )
}
