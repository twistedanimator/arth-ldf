<template>
  <v-app>
    <v-main>

    	<v-container>
    		<v-row>

      			<v-col>
					<v-card height="100%">
						<v-card-text>
							<v-form ref="form">

								<v-text-field label="Имя" v-model="name" ref="nameInput" dense/>
								<v-text-field label="Фамилия" v-model="surname" dense/>

								<v-text-field label="Дата" v-model="date" type="date" dense/>
								<v-text-field label="Время" v-model="time" type="time" dense/>

								<v-text-field v-for="(c, index) in coefs" :label="c[0]" v-model.number="values[index]" :key="index" type="number" dense/>								

							</v-form>
						</v-card-text>
					</v-card>						
      			</v-col>

				<v-col>
					<v-card height="100%"> 

						<v-card-text>
							<v-list>
								<v-list-item v-for="(label, index) in ldfLabels" :key="index">									
									<v-list-item-content :class="{'red--text': index === ldfMaxIndex}">
										<v-list-item-title v-text="`${label}`"/>
										<v-list-item-subtitle v-text="ldf[index]"/>
									</v-list-item-content>
								</v-list-item>

								<v-btn @click="add" color="primary" width="100%" :style="{margin: '15px 0'}" :disabled="!canAdd">ДОБАВИТЬ</v-btn>
								<v-btn @click="save" color="error" width="100%" tabindex="-1" :disabled="!this.entries.length">СОХРАНИТЬ</v-btn>
							</v-list>
						</v-card-text>

					</v-card>						
      			</v-col>

				<v-col cols="5" lg="6">
					<v-card height="100%">

						<v-simple-table dense>							
							<template v-slot:default>

								<thead>
									<tr>
									<th class="text-left">
										Время
									</th>
									<th class="text-left">
										Имя
									</th>
									<th class="text-left">
										Фамилия
									</th>
									<th class="text-left">
										Уровень
									</th>
									</tr>
								</thead>

								<tbody>
									<tr v-for="(item, index) in entries" :key="index">
										<td>{{ item.date }} {{ item.time }}</td>
										<td>{{ item.name }}</td>
										<td>{{ item.surname }}</td>
										<td>{{ item.value }}</td>
									</tr>
								</tbody>

							</template>
						</v-simple-table>

					</v-card>					
				</v-col>

    		</v-row>

			
    	</v-container>

    </v-main>

	<a ref="invisibleAnchor"/>
  </v-app>
</template>

<script>

export default 
{
  name: 'App',

  data: () => ({

		name: '',
		surname: '',
		date: 0,
		time: 0,

		values: [],

		entries: [],

		isOpenedDatePicker: false,

		ldfLabels: ['катаболизм', 'анаболизм'],

		coeficients: [
			[ 'Константа', -305.144, -278.649 ],
			[ 'Креатинин', 0.936, 0.801 ],
			[ 'Мочевая кислота', 0.072, 0.047 ],
			[ 'Мочевина', 4.018, 3.281 ],
			[ 'Тестостерон', 0.029, 0.169 ],
			[ 'Щелочная фосфатаза', 0.081, 0.077 ],
			[ 'Альбумин', 0, 0 ],
			[ 'Кальций общий', 127.092, 125.615 ],
			[ 'Общий белок', 1.794, 1.823 ],
		]

  }),

  mounted()
  {
	  this.values = Array(this.coeficients.length - 1)
	  this.reset()
  },

  computed:
  {
	  coefs()
	  {
		  const [constant, ...coefs] = this.coeficients
		  return coefs
	  },

	  ldf()
	  {
		return this.ldfLabels.map( (_, i) =>
		{
			return this.coeficients
				.map((coef, index) => coef[i+1] * (index? this.values[index - 1] : 1))
				.reduce((sum, value) => sum + value, 0)
		})
	  },

	  ldfMaxIndex()
	  {
		  return this.ldf.indexOf(Math.max(...this.ldf))
	  },
	  canAdd()
	  {
		  return this.name && this.surname
	  }
	  
  },

  methods:
  {
	  save()
	  {
		let a = this.$refs.invisibleAnchor
		let text = this.entries.reduce( (acc, item) => `${acc}${item.date}\t${item.time}\t${item.name}\t${item.surname}\t${item.value}\n`, '' )
		let file = new Blob([text], {type: 'text/csv'});
		a.href = URL.createObjectURL(file);
		a.download = 'data.csv';
		a.click()
	  },

	  add()
	  {
		  this.entries.push({
			  name: this.name,
			  surname: this.surname,
			  value: this.ldfLabels[this.ldfMaxIndex],
			  date: this.date,
			  time: this.time
		  })

		  this.reset()
	  },

	  reset()
	  {
		  this.name = this.surname = ''		  

		  this.values.fill(0)

		  const date = new Date()
		  this.date = date.toISOString().substr(0, 10)
		  this.time = date.toISOString().substr(11, 5)

		  this.isOpenedDatePicker = false
		  this.$nextTick( () => this.$refs.nameInput.focus() )
	  }
  }
};
</script>
