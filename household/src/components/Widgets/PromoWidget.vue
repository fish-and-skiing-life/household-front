<template>
   <div class="promo-widget">
		<app-card customClasses="border-info">
			<v-layout row wrap>
				<v-flex xl3 lg3 md2 sm3 xs4 b-50>
					<div class="d-custom-flex justify-center align-items-center">
						<img class="img-responsive" alt="transform" src="/static/img/Freetransform.png" />
					</div>
				</v-flex>
				<v-flex xl9 lg9 md10 sm9 xs8 b-50>
					<div>
						<h4>アンケートを活用しましょう</h4>
						<p class="fs-12 grey--text">インパクトレポートを作成する上でデータ収集は非常に大切なものです。一般的にはアンケートなどが主流となっています。このツールでは、アンケート作成、共有機能まであります。ぜひご活用ください。</p>
						<v-btn color="info" class="fs-12 fw-normal">{{$t('message.purchaseVuely')}}</v-btn>
					</div>
				</v-flex>
			</v-layout>
		</app-card>
	</div>
</template>
